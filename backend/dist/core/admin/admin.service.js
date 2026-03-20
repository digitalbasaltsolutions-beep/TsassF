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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_schema_1 = require("../organizations/schemas/organization.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const membership_schema_1 = require("../organizations/schemas/membership.schema");
let AdminService = class AdminService {
    orgModel;
    userModel;
    membershipModel;
    constructor(orgModel, userModel, membershipModel) {
        this.orgModel = orgModel;
        this.userModel = userModel;
        this.membershipModel = membershipModel;
    }
    async getAllOrganizations() {
        return this.orgModel.find().exec();
    }
    async getAllUsers() {
        return this.userModel.find({}, { passwordHash: 0 }).exec();
    }
    async deleteOrganization(id) {
        const org = await this.orgModel.findById(id);
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        await this.membershipModel.deleteMany({ organizationId: org._id });
        await org.deleteOne();
        return { success: true };
    }
    async updateOrganization(id, data) {
        const org = await this.orgModel.findById(id);
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        if (data.subscriptions)
            org.subscriptions = data.subscriptions;
        if (data.subscriptionPlan)
            org.subscriptionPlan = data.subscriptionPlan;
        await org.save();
        return org;
    }
    async getGlobalStats() {
        const orgCount = await this.orgModel.countDocuments();
        const userCount = await this.userModel.countDocuments();
        return {
            totalOrganizations: orgCount,
            totalUsers: userCount,
            activeSubscriptions: orgCount * 2,
            mrr: (orgCount * 99) + 1500,
            status: 'operational',
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map