import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private organizationsService;
    private jwtService;
    constructor(usersService: UsersService, organizationsService: OrganizationsService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto, organizationId?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
}
