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
exports.EcommerceController = void 0;
const common_1 = require("@nestjs/common");
const ecommerce_service_1 = require("./ecommerce.service");
const jwt_auth_guard_1 = require("../../core/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../core/auth/guards/roles.guard");
const roles_decorator_1 = require("../../core/auth/decorators/roles.decorator");
const roles_enum_1 = require("../../shared/constants/roles.enum");
let EcommerceController = class EcommerceController {
    ecommerceService;
    constructor(ecommerceService) {
        this.ecommerceService = ecommerceService;
    }
    async getProducts() {
        return this.ecommerceService.getProducts();
    }
    async createProduct(data) {
        return this.ecommerceService.createProduct(data);
    }
    async getOrders() {
        return this.ecommerceService.getOrders();
    }
    async createOrder(data) {
        return this.ecommerceService.createOrder(data);
    }
    async updateOrderStatus(id, status) {
        return this.ecommerceService.updateOrderStatus(id, status);
    }
};
exports.EcommerceController = EcommerceController;
__decorate([
    (0, common_1.Get)('products'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner, roles_enum_1.Role.Member),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcommerceController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('products'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EcommerceController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner, roles_enum_1.Role.Member),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcommerceController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner, roles_enum_1.Role.Member),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EcommerceController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Put)('orders/:id/status'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.Owner),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EcommerceController.prototype, "updateOrderStatus", null);
exports.EcommerceController = EcommerceController = __decorate([
    (0, common_1.Controller)('ecommerce'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ecommerce_service_1.EcommerceService])
], EcommerceController);
//# sourceMappingURL=ecommerce.controller.js.map