"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
const organizations_service_1 = require("../organizations/organizations.service");
const redis_service_1 = require("../../shared/redis/redis.service");
const roles_enum_1 = require("../../shared/constants/roles.enum");
let AuthService = class AuthService {
    usersService;
    organizationsService;
    jwtService;
    redisService;
    constructor(usersService, organizationsService, jwtService, redisService) {
        this.usersService = usersService;
        this.organizationsService = organizationsService;
        this.jwtService = jwtService;
        this.redisService = redisService;
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.UnauthorizedException('Email already in use');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(registerDto.password, salt);
        const user = await this.usersService.create({
            name: registerDto.name,
            email: registerDto.email,
            passwordHash,
        });
        const org = await this.organizationsService.createOrganization(registerDto.organizationName, user._id.toString());
        return this.generateTokens(user._id.toString(), org._id.toString(), user.email, roles_enum_1.Role.Owner, user.isOnboarded);
    }
    async login(loginDto, organizationId) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const orgs = await this.organizationsService.getUserOrganizations(user._id.toString());
        if (orgs.length === 0) {
            throw new common_1.ForbiddenException('User has no organization memberships');
        }
        const targetOrgId = organizationId || orgs[0]._id.toString();
        const membership = await this.organizationsService.getMembership(user._id.toString(), targetOrgId);
        if (!membership) {
            throw new common_1.ForbiddenException('User is not a member of this organization');
        }
        return this.generateTokens(user._id.toString(), targetOrgId, user.email, membership.role, user.isOnboarded);
    }
    async switchOrganization(userId, targetOrgId, email) {
        const membership = await this.organizationsService.getMembership(userId, targetOrgId);
        if (!membership) {
            throw new common_1.ForbiddenException('User is not a member of this organization');
        }
        return this.generateTokens(userId, targetOrgId, email, membership.role);
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const userId = payload.sub;
            const cachedToken = await this.redisService.get(`refresh_token:${userId}`);
            if (cachedToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
            }
            const user = await this.usersService.findById(userId);
            if (!user)
                throw new common_1.UnauthorizedException();
            const membership = await this.organizationsService.getMembership(userId, payload.organizationId);
            if (!membership)
                throw new common_1.ForbiddenException();
            return this.generateTokens(userId, payload.organizationId, user.email, membership.role, user.isOnboarded);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.redisService.del(`refresh_token:${userId}`);
        return { success: true };
    }
    async getProfile(userId) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const memberships = await this.organizationsService.getUserOrganizations(userId);
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            isOnboarded: user.isOnboarded,
            completedSteps: user.completedSteps || ['org'],
            memberships
        };
    }
    async generateTokens(userId, organizationId, email, role, isOnboarded = true) {
        const payload = { sub: userId, email, organizationId, role, isOnboarded };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.redisService.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
        let orgData = null;
        let subscriptions = ['crm'];
        let plan = 'Free';
        if (organizationId) {
            const org = await this.organizationsService.getOrganizationById(organizationId);
            if (org) {
                orgData = org;
                subscriptions = org.subscriptions || ['crm'];
                plan = org.subscriptionPlan || 'Free';
            }
        }
        return {
            accessToken,
            refreshToken,
            user: { id: userId, email, organizationId, role, isOnboarded },
            organization: orgData,
            subscriptions,
            plan
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        organizations_service_1.OrganizationsService,
        jwt_1.JwtService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map