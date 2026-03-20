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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subscription_schema_js_1 = require("./schemas/subscription.schema.js");
const contact_schema_js_1 = require("../../modules/crm/schemas/contact.schema.js");
const deal_schema_js_1 = require("../../modules/crm/schemas/deal.schema.js");
const pipeline_schema_js_1 = require("../../modules/crm/schemas/pipeline.schema.js");
const membership_schema_js_1 = require("../organizations/schemas/membership.schema.js");
const plan_limits_js_1 = require("./constants/plan-limits.js");
const notifications_service_js_1 = require("../notifications/notifications.service.js");
const redis_service_js_1 = require("../../shared/redis/redis.service.js");
let UsageService = class UsageService {
    subModel;
    contactModel;
    dealModel;
    pipelineModel;
    membershipModel;
    notificationsService;
    redisService;
    constructor(subModel, contactModel, dealModel, pipelineModel, membershipModel, notificationsService, redisService) {
        this.subModel = subModel;
        this.contactModel = contactModel;
        this.dealModel = dealModel;
        this.pipelineModel = pipelineModel;
        this.membershipModel = membershipModel;
        this.notificationsService = notificationsService;
        this.redisService = redisService;
    }
    async getUsage(organizationId) {
        const cacheKey = `usage:${organizationId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const orgId = new mongoose_2.Types.ObjectId(organizationId);
        const sub = await this.subModel.findOne({ organizationId: orgId }).exec();
        const plan = sub?.plan || subscription_schema_js_1.PlanType.Free;
        const [contactsCount, dealsCount, membersCount, pipelinesCount] = await Promise.all([
            this.contactModel.countDocuments({ organizationId: orgId }),
            this.dealModel.countDocuments({ organizationId: orgId }),
            this.membershipModel.countDocuments({ organizationId: orgId }),
            this.pipelineModel.countDocuments({ organizationId: orgId }),
        ]);
        const limits = plan_limits_js_1.PLAN_LIMITS[plan];
        const isNearLimit = {
            contacts: contactsCount >= limits.contacts * 0.8,
            deals: dealsCount >= limits.deals * 0.8,
            members: membersCount >= limits.members * 0.8,
            pipelines: pipelinesCount >= (limits.pipelines || 5) * 0.8,
        };
        if (isNearLimit.contacts || isNearLimit.deals || isNearLimit.pipelines) {
            this.notificationsService.createNotification(organizationId, '⚠️ Usage Warning', 'You have reached 80% of your current plan limits. Upgrade now to ensure uninterrupted service.', 'billing').catch(() => { });
        }
        const result = {
            plan,
            usage: {
                contacts: contactsCount,
                deals: dealsCount,
                members: membersCount,
                pipelines: pipelinesCount,
            },
            limits,
            isNearLimit
        };
        await this.redisService.set(cacheKey, JSON.stringify(result), 'EX', 300);
        return result;
    }
    async checkLimit(organizationId, type) {
        const stats = await this.getUsage(organizationId);
        const current = stats.usage[type];
        const limit = stats.limits[type] || Infinity;
        if (current >= limit) {
            throw new common_1.ForbiddenException(`You have reached the ${type} limit for your ${stats.plan} plan. Please upgrade to continue.`);
        }
        return true;
    }
};
exports.UsageService = UsageService;
exports.UsageService = UsageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subscription_schema_js_1.Subscription.name)),
    __param(1, (0, mongoose_1.InjectModel)(contact_schema_js_1.Contact.name)),
    __param(2, (0, mongoose_1.InjectModel)(deal_schema_js_1.Deal.name)),
    __param(3, (0, mongoose_1.InjectModel)(pipeline_schema_js_1.Pipeline.name)),
    __param(4, (0, mongoose_1.InjectModel)(membership_schema_js_1.Membership.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_js_1.NotificationsService,
        redis_service_js_1.RedisService])
], UsageService);
//# sourceMappingURL=usage.service.js.map