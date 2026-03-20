import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { RedisService } from '../../shared/redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private organizationsService;
    private jwtService;
    private redisService;
    constructor(usersService: UsersService, organizationsService: OrganizationsService, jwtService: JwtService, redisService: RedisService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            organizationId: string | undefined;
            role: string;
            isOnboarded: boolean;
        };
        organization: import("../organizations/schemas/organization.schema").Organization | null;
        subscriptions: string[];
        plan: string;
    }>;
    login(loginDto: LoginDto, organizationId?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            organizationId: string | undefined;
            role: string;
            isOnboarded: boolean;
        };
        organization: import("../organizations/schemas/organization.schema").Organization | null;
        subscriptions: string[];
        plan: string;
    }>;
    switchOrganization(userId: string, targetOrgId: string, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            organizationId: string | undefined;
            role: string;
            isOnboarded: boolean;
        };
        organization: import("../organizations/schemas/organization.schema").Organization | null;
        subscriptions: string[];
        plan: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            organizationId: string | undefined;
            role: string;
            isOnboarded: boolean;
        };
        organization: import("../organizations/schemas/organization.schema").Organization | null;
        subscriptions: string[];
        plan: string;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    getProfile(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        name: string;
        isOnboarded: boolean;
        completedSteps: any;
        memberships: import("../organizations/schemas/organization.schema").Organization[];
    }>;
    private generateTokens;
}
