import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { RedisService } from '../../shared/redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../../shared/constants/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      passwordHash,
    });

    const org = await this.organizationsService.createOrganization(
      registerDto.organizationName,
      user._id.toString(),
    );

    return this.generateTokens(user._id.toString(), org._id.toString(), user.email, Role.Owner, user.isOnboarded);
  }

  async login(loginDto: LoginDto, organizationId?: string) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const orgs = await this.organizationsService.getUserOrganizations(user._id.toString());
    if (orgs.length === 0) {
      // User must always have at least one org context in this system
      throw new ForbiddenException('User has no organization memberships');
    }

    const targetOrgId = organizationId || orgs[0]._id.toString();
    const membership = await this.organizationsService.getMembership(user._id.toString(), targetOrgId);
    
    if (!membership) {
      throw new ForbiddenException('User is not a member of this organization');
    }

    return this.generateTokens(user._id.toString(), targetOrgId, user.email, membership.role, user.isOnboarded);
  }

  async switchOrganization(userId: string, targetOrgId: string, email: string) {
    const membership = await this.organizationsService.getMembership(userId, targetOrgId);
    if (!membership) {
      throw new ForbiddenException('User is not a member of this organization');
    }

    return this.generateTokens(userId, targetOrgId, email, membership.role);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const userId = payload.sub;
      const cachedToken = await this.redisService.get(`refresh_token:${userId}`);
      
      if (cachedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const user = await this.usersService.findById(userId);
      if (!user) throw new UnauthorizedException();

      const membership = await this.organizationsService.getMembership(userId, payload.organizationId);
      if (!membership) throw new ForbiddenException();

      return this.generateTokens(userId, payload.organizationId, user.email, membership.role, user.isOnboarded);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.redisService.del(`refresh_token:${userId}`);
    return { success: true };
  }

  private async generateTokens(userId: string, organizationId: string | undefined, email: string, role: string, isOnboarded: boolean = true) {
    const payload = { sub: userId, email, organizationId, role, isOnboarded };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store refresh token in Redis for validation/logout
    await this.redisService.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

    return {
      accessToken,
      refreshToken,
      user: { id: userId, email, organizationId, role, isOnboarded }
    };
  }
}
