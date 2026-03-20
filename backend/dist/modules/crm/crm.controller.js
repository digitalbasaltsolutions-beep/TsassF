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
exports.CrmController = void 0;
const common_1 = require("@nestjs/common");
const crm_service_js_1 = require("./crm.service.js");
const jwt_auth_guard_js_1 = require("../../core/auth/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../../core/auth/guards/roles.guard.js");
const roles_decorator_js_1 = require("../../core/auth/decorators/roles.decorator.js");
const roles_enum_js_1 = require("../../shared/constants/roles.enum.js");
const usage_guard_js_1 = require("../../core/billing/guards/usage.guard.js");
const usage_decorator_js_1 = require("../../core/billing/decorators/usage.decorator.js");
const create_contact_dto_js_1 = require("./dto/create-contact.dto.js");
const create_deal_dto_js_1 = require("./dto/create-deal.dto.js");
const pipeline_stage_dto_js_1 = require("./dto/pipeline-stage.dto.js");
const create_activity_dto_js_1 = require("./dto/create-activity.dto.js");
const create_note_dto_js_1 = require("./dto/create-note.dto.js");
let CrmController = class CrmController {
    crmService;
    constructor(crmService) {
        this.crmService = crmService;
    }
    async createContact(req, data) {
        return this.crmService.createContact(req.user.organizationId, req.user.userId, data);
    }
    async getContacts(req, search, page, limit) {
        return this.crmService.getContacts(req.user, { search, page, limit });
    }
    async getContactById(req, id) {
        return this.crmService.getContactById(req.user.organizationId, id);
    }
    async updateContact(req, id, data) {
        return this.crmService.updateContact(req.user.organizationId, req.user.userId, id, data);
    }
    async deleteContact(req, id) {
        return this.crmService.softDeleteContact(req.user.organizationId, req.user.userId, id);
    }
    async bulkDeleteContacts(req, ids) {
        return this.crmService.bulkDeleteContacts(req.user.organizationId, req.user.userId, ids);
    }
    async createPipeline(req, data) {
        return this.crmService.createPipeline(req.user.organizationId, req.user.userId, data);
    }
    async getPipelines(req) {
        return this.crmService.getPipelines(req.user.organizationId);
    }
    async updatePipeline(req, id, data) {
        return this.crmService.updatePipeline(req.user.organizationId, req.user.userId, id, data);
    }
    async deletePipeline(req, id) {
        return this.crmService.deletePipeline(req.user.organizationId, req.user.userId, id);
    }
    async createStage(req, data) {
        return this.crmService.createStage(req.user.organizationId, req.user.userId, data);
    }
    async getStages(id) {
        return this.crmService.getStages(id);
    }
    async updateStage(req, id, data) {
        return this.crmService.updateStage(req.user.organizationId, req.user.userId, id, data);
    }
    async deleteStage(req, id) {
        return this.crmService.deleteStage(req.user.organizationId, req.user.userId, id);
    }
    async reorderStages(req, id, stages) {
        return this.crmService.reorderStages(req.user.organizationId, req.user.userId, id, stages);
    }
    async createDeal(req, data) {
        return this.crmService.createDeal(req.user.organizationId, req.user.userId, data);
    }
    async getDeals(req, pipelineId, search, page, limit) {
        return this.crmService.getDeals(req.user, { pipelineId, search, page, limit });
    }
    async getDealById(req, id) {
        return this.crmService.getDealById(req.user.organizationId, id);
    }
    async updateDeal(req, id, data) {
        return this.crmService.updateDeal(req.user.organizationId, req.user.userId, id, data);
    }
    async deleteDeal(req, id) {
        return this.crmService.deleteDeal(req.user.organizationId, req.user.userId, id);
    }
    async moveDealStage(req, id, stageId) {
        return this.crmService.moveDealStage(req.user.organizationId, req.user.userId, id, stageId);
    }
    async bulkMoveDealsStage(req, ids, targetStageId) {
        return this.crmService.bulkMoveDealsStage(req.user.organizationId, req.user.userId, ids, targetStageId);
    }
    async logActivity(req, data) {
        return this.crmService.logActivity(req.user.organizationId, req.user.userId, data);
    }
    async getActivities(req, contactId, dealId, page, limit) {
        return this.crmService.getActivities(req.user.organizationId, { contactId, dealId, page, limit });
    }
    async updateActivity(req, id, data) {
        return this.crmService.updateActivity(req.user.organizationId, req.user.userId, id, data);
    }
    async deleteActivity(req, id) {
        return this.crmService.deleteActivity(req.user.organizationId, req.user.userId, id);
    }
    async getTimeline(req, contactId, dealId) {
        return this.crmService.getTimeline(req.user.organizationId, contactId, dealId);
    }
    async addNote(req, data) {
        return this.crmService.addNote(req.user.organizationId, req.user.userId, data);
    }
    async getNotes(req, linkedEntityId, page, limit) {
        return this.crmService.getNotes(req.user.organizationId, { linkedEntityId, page, limit });
    }
    async updateNote(req, id, data) {
        return this.crmService.updateNote(req.user.organizationId, req.user.userId, id, data);
    }
    async deleteNote(req, id) {
        return this.crmService.deleteNote(req.user.organizationId, req.user.userId, id);
    }
    async sendWhatsAppMessage(id, message) {
        return this.crmService.sendWhatsAppAsync(id, message);
    }
    async getTeamMembers(req) {
        return this.crmService.getTeamMembers(req.user.organizationId);
    }
    async addTeamMember(req, body) {
        return this.crmService.addTeamMember(req.user.organizationId, body.userId, body.role);
    }
};
exports.CrmController = CrmController;
__decorate([
    (0, common_1.Post)('contacts'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    (0, usage_decorator_js_1.SetUsageType)('contacts'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_contact_dto_js_1.CreateContactDto]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createContact", null);
__decorate([
    (0, common_1.Get)('contacts'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Get)('contacts/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getContactById", null);
__decorate([
    (0, common_1.Put)('contacts/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Delete)('contacts/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "deleteContact", null);
__decorate([
    (0, common_1.Post)('contacts/bulk-delete'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "bulkDeleteContacts", null);
__decorate([
    (0, common_1.Post)('pipelines'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    (0, usage_decorator_js_1.SetUsageType)('pipelines'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pipeline_stage_dto_js_1.CreatePipelineDto]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createPipeline", null);
__decorate([
    (0, common_1.Get)('pipelines'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getPipelines", null);
__decorate([
    (0, common_1.Put)('pipelines/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updatePipeline", null);
__decorate([
    (0, common_1.Delete)('pipelines/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "deletePipeline", null);
__decorate([
    (0, common_1.Post)('stages'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pipeline_stage_dto_js_1.CreateStageDto]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createStage", null);
__decorate([
    (0, common_1.Get)('pipelines/:id/stages'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getStages", null);
__decorate([
    (0, common_1.Put)('stages/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateStage", null);
__decorate([
    (0, common_1.Delete)('stages/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "deleteStage", null);
__decorate([
    (0, common_1.Patch)('pipelines/:id/reorder-stages'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('stages')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "reorderStages", null);
__decorate([
    (0, common_1.Post)('deals'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    (0, usage_decorator_js_1.SetUsageType)('deals'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_deal_dto_js_1.CreateDealDto]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createDeal", null);
__decorate([
    (0, common_1.Get)('deals'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('pipelineId')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getDeals", null);
__decorate([
    (0, common_1.Get)('deals/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getDealById", null);
__decorate([
    (0, common_1.Put)('deals/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateDeal", null);
__decorate([
    (0, common_1.Delete)('deals/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "deleteDeal", null);
__decorate([
    (0, common_1.Patch)('deals/:id/move-stage'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('stageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "moveDealStage", null);
__decorate([
    (0, common_1.Post)('deals/bulk-move'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('ids')),
    __param(2, (0, common_1.Body)('targetStageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "bulkMoveDealsStage", null);
__decorate([
    (0, common_1.Post)('activities'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_activity_dto_js_1.CreateActivityDto]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "logActivity", null);
__decorate([
    (0, common_1.Get)('activities'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('contactId')),
    __param(2, (0, common_1.Query)('dealId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getActivities", null);
__decorate([
    (0, common_1.Put)('activities/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateActivity", null);
__decorate([
    (0, common_1.Delete)('activities/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "deleteActivity", null);
__decorate([
    (0, common_1.Get)('timeline'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('contactId')),
    __param(2, (0, common_1.Query)('dealId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Post)('notes'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_note_dto_js_1.CreateNoteDto]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "addNote", null);
__decorate([
    (0, common_1.Get)('notes'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('linkedEntityId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getNotes", null);
__decorate([
    (0, common_1.Put)('notes/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateNote", null);
__decorate([
    (0, common_1.Delete)('notes/:id'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "deleteNote", null);
__decorate([
    (0, common_1.Post)('contacts/:id/whatsapp'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "sendWhatsAppMessage", null);
__decorate([
    (0, common_1.Get)('team-members'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Member),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getTeamMembers", null);
__decorate([
    (0, common_1.Post)('team-members'),
    (0, roles_decorator_js_1.Roles)(roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.Owner),
    (0, usage_decorator_js_1.SetUsageType)('members'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "addTeamMember", null);
exports.CrmController = CrmController = __decorate([
    (0, common_1.Controller)('crm'),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard, usage_guard_js_1.UsageGuard),
    __metadata("design:paramtypes", [crm_service_js_1.CrmService])
], CrmController);
//# sourceMappingURL=crm.controller.js.map