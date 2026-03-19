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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_schema_1 = require("./schemas/organization.schema");
const membership_schema_1 = require("./schemas/membership.schema");
const roles_enum_1 = require("../../shared/constants/roles.enum");
let OrganizationsService = class OrganizationsService {
    orgModel;
    membershipModel;
    constructor(orgModel, membershipModel) {
        this.orgModel = orgModel;
        this.membershipModel = membershipModel;
    }
    async createOrganization(name, ownerId) {
        const org = new this.orgModel({ name, ownerId: new mongoose_2.Types.ObjectId(ownerId) });
        const savedOrg = await org.save();
        await this.membershipModel.create({
            userId: new mongoose_2.Types.ObjectId(ownerId),
            organizationId: savedOrg._id,
            role: roles_enum_1.Role.Owner,
        });
        return savedOrg;
    }
    async getUserOrganizations(userId) {
        const memberships = await this.membershipModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).exec();
        const orgIds = memberships.map(m => m.organizationId);
        return this.orgModel.find({ _id: { $in: orgIds } }).exec();
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __param(1, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map