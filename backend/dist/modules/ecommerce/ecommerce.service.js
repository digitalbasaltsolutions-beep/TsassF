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
exports.EcommerceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const order_schema_1 = require("./schemas/order.schema");
let EcommerceService = class EcommerceService {
    productModel;
    orderModel;
    constructor(productModel, orderModel) {
        this.productModel = productModel;
        this.orderModel = orderModel;
    }
    async getProducts() {
        return this.productModel.find().exec();
    }
    async createProduct(data) {
        return this.productModel.create(data);
    }
    async getOrders() {
        return this.orderModel.find().populate('customer', 'name email').populate('products', 'title price').exec();
    }
    async createOrder(data) {
        return this.orderModel.create(data);
    }
    async updateOrderStatus(id, status) {
        const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
};
exports.EcommerceService = EcommerceService;
exports.EcommerceService = EcommerceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], EcommerceService);
//# sourceMappingURL=ecommerce.service.js.map