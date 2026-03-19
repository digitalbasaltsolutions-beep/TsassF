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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subscription_schema_1 = require("./schemas/subscription.schema");
const organizations_service_1 = require("../organizations/organizations.service");
let BillingService = class BillingService {
    subscriptionModel;
    organizationsService;
    constructor(subscriptionModel, organizationsService) {
        this.subscriptionModel = subscriptionModel;
        this.organizationsService = organizationsService;
    }
    async getSubscriptionForOrg(organizationId) {
        const sub = await this.subscriptionModel.findOne({ organizationId: new mongoose_2.Types.ObjectId(organizationId) }).exec();
        if (!sub) {
            return this.subscriptionModel.create({
                organizationId: new mongoose_2.Types.ObjectId(organizationId),
                plan: subscription_schema_1.PlanType.Free,
                status: 'active',
            });
        }
        return sub;
    }
    async upgradePlan(organizationId, plan) {
        let sub = await this.subscriptionModel.findOne({ organizationId: new mongoose_2.Types.ObjectId(organizationId) }).exec();
        if (!sub) {
            sub = new this.subscriptionModel({
                organizationId: new mongoose_2.Types.ObjectId(organizationId),
                plan: subscription_schema_1.PlanType.Free,
            });
        }
        sub.plan = plan;
        sub.status = 'active';
        sub.stripeCustomerId = 'cus_mock123';
        sub.stripeSubscriptionId = 'sub_mock123';
        return sub.save();
    }
    getPlans() {
        return [
            { id: subscription_schema_1.PlanType.Free, name: 'Free Plan', price: 0, limits: { contacts: 100 } },
            { id: subscription_schema_1.PlanType.Pro, name: 'Pro Plan', price: 29, limits: { contacts: 1000 } },
            { id: subscription_schema_1.PlanType.Enterprise, name: 'Enterprise Plan', price: 99, limits: { contacts: 10000 } },
        ];
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        organizations_service_1.OrganizationsService])
], BillingService);
//# sourceMappingURL=billing.service.js.map