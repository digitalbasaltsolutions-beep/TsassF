import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
    private jwtService: JwtService,
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

    return this.generateTokens(user._id.toString(), org._id.toString(), user.email);
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

    let defaultOrgId = organizationId;

    if (!defaultOrgId) {
      const orgs = await this.organizationsService.getUserOrganizations(user._id.toString());
      if (orgs.length > 0) {
        defaultOrgId = orgs[0]._id.toString();
      }
    }

    return this.generateTokens(user._id.toString(), defaultOrgId, user.email);
  }

  private generateTokens(userId: string, organizationId: string | undefined, email: string) {
    const payload = { sub: userId, email, organizationId };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
