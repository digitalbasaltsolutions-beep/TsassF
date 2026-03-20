import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SwitchOrgDto } from './dto/switch-org.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(loginDto: LoginDto): Promise<{
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
    switchOrg(req: any, dto: SwitchOrgDto): Promise<{
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
    refresh(refreshToken: string): Promise<{
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
    logout(req: any): Promise<{
        success: boolean;
    }>;
    getMe(req: any): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        name: string;
        isOnboarded: boolean;
        completedSteps: any;
        memberships: import("../organizations/schemas/organization.schema").Organization[];
    }>;
}
