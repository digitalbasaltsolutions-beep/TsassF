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
const organization_schema_js_1 = require("./schemas/organization.schema.js");
const membership_schema_js_1 = require("./schemas/membership.schema.js");
const roles_enum_js_1 = require("../../shared/constants/roles.enum.js");
const crm_service_js_1 = require("../../modules/crm/crm.service.js");
let OrganizationsService = class OrganizationsService {
    orgModel;
    membershipModel;
    crmService;
    constructor(orgModel, membershipModel, crmService) {
        this.orgModel = orgModel;
        this.membershipModel = membershipModel;
        this.crmService = crmService;
    }
    async createOrganization(name, ownerId) {
        const org = new this.orgModel({ name, ownerId: new mongoose_2.Types.ObjectId(ownerId) });
        const savedOrg = await org.save();
        await this.membershipModel.create({
            userId: new mongoose_2.Types.ObjectId(ownerId),
            organizationId: savedOrg._id,
            role: roles_enum_js_1.Role.Owner,
        });
        try {
            const pipeline = await this.crmService.createPipeline(savedOrg._id.toString(), ownerId, {
                name: 'Sales Pipeline'
            });
            const defaultStages = [
                { name: 'Lead', order: 0, color: '#94a3b8' },
                { name: 'Qualified', order: 1, color: '#3b82f6' },
                { name: 'Proposal', order: 2, color: '#eab308' },
                { name: 'Won', order: 3, color: '#22c55e' }
            ];
            for (const stage of defaultStages) {
                await this.crmService.createStage(savedOrg._id.toString(), ownerId, {
                    ...stage,
                    pipelineId: pipeline._id.toString()
                });
            }
        }
        catch (error) {
            console.error('Failed to create default pipeline:', error);
        }
        return savedOrg;
    }
    async getUserOrganizations(userId) {
        const memberships = await this.membershipModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).exec();
        const orgIds = memberships.map(m => m.organizationId);
        return this.orgModel.find({ _id: { $in: orgIds } }).exec();
    }
    async getOrganizationById(id) {
        return this.orgModel.findById(id).exec();
    }
    async getMembership(userId, organizationId) {
        return this.membershipModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
        }).exec();
    }
    async getMembers(organizationId) {
        return this.membershipModel.find({ organizationId: new mongoose_2.Types.ObjectId(organizationId) }).exec();
    }
    async addMember(organizationId, userId, role = roles_enum_js_1.Role.Member) {
        return this.membershipModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            role,
        });
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_schema_js_1.Organization.name)),
    __param(1, (0, mongoose_1.InjectModel)(membership_schema_js_1.Membership.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => crm_service_js_1.CrmService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        crm_service_js_1.CrmService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map