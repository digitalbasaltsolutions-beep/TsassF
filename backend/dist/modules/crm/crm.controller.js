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
const crm_service_1 = require("./crm.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_enum_1 = require("../../shared/constants/roles.enum");
let CrmController = class CrmController {
    crmService;
    constructor(crmService) {
        this.crmService = crmService;
    }
    async createContact(data) {
        return this.crmService.createContact(data);
    }
    async getContacts() {
        return this.crmService.getContacts();
    }
    async createDeal(data) {
        return this.crmService.createDeal(data);
    }
    async getDeals() {
        return this.crmService.getDeals();
    }
    async updateDealStage(id, pipelineStage) {
        return this.crmService.updateDealStage(id, pipelineStage);
    }
    async logActivity(data) {
        return this.crmService.logActivity(data);
    }
    async getDealActivities(id) {
        return this.crmService.getActivitiesForDeal(id);
    }
};
exports.CrmController = CrmController;
__decorate([
    (0, common_1.Post)('contacts'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner, roles_enum_1.Role.Member),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createContact", null);
__decorate([
    (0, common_1.Get)('contacts'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner, roles_enum_1.Role.Member),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Post)('deals'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner, roles_enum_1.Role.Member),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createDeal", null);
__decorate([
    (0, common_1.Get)('deals'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner, roles_enum_1.Role.Member),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getDeals", null);
__decorate([
    (0, common_1.Put)('deals/:id/stage'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner, roles_enum_1.Role.Member),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('pipelineStage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateDealStage", null);
__decorate([
    (0, common_1.Post)('activities'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner, roles_enum_1.Role.Member),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "logActivity", null);
__decorate([
    (0, common_1.Get)('deals/:id/activities'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner, roles_enum_1.Role.Member),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getDealActivities", null);
exports.CrmController = CrmController = __decorate([
    (0, common_1.Controller)('crm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [crm_service_1.CrmService])
], CrmController);
//# sourceMappingURL=crm.controller.js.map