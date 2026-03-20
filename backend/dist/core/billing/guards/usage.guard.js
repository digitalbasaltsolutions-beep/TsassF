"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const usage_service_js_1 = require("../usage.service.js");
const analytics_service_js_1 = require("../../../shared/analytics/analytics.service.js");
let UsageGuard = class UsageGuard {
    reflector;
    usageService;
    analyticsService;
    constructor(reflector, usageService, analyticsService) {
        this.reflector = reflector;
        this.usageService = usageService;
        this.analyticsService = analyticsService;
    }
    async canActivate(context) {
        const usageType = this.reflector.get('usageType', context.getHandler());
        if (!usageType) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.organizationId) {
            throw new common_1.ForbiddenException('No active organization context');
        }
        const request = context.switchToHttp().getRequest();
        if (request.method !== 'POST')
            return true;
        try {
            await this.usageService.checkLimit(user.organizationId, usageType);
        }
        catch (e) {
            await this.analyticsService.trackLimitHit(user.organizationId, usageType, user.userId);
            throw e;
        }
        return true;
    }
};
exports.UsageGuard = UsageGuard;
exports.UsageGuard = UsageGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        usage_service_js_1.UsageService,
        analytics_service_js_1.AnalyticsService])
], UsageGuard);
//# sourceMappingURL=usage.guard.js.map