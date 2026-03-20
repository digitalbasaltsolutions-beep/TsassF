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
exports.DealSchema = exports.Deal = exports.DealStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_js_1 = require("../../../shared/database/base.schema.js");
const tenant_plugin_js_1 = require("../../../shared/database/tenant.plugin.js");
var DealStatus;
(function (DealStatus) {
    DealStatus["Open"] = "Open";
    DealStatus["Won"] = "Won";
    DealStatus["Lost"] = "Lost";
})(DealStatus || (exports.DealStatus = DealStatus = {}));
let Deal = class Deal extends base_schema_js_1.BaseDocument {
    title;
    value;
    status;
    pipelineId;
    stageId;
    contactId;
    ownerId;
    expectedCloseDate;
};
exports.Deal = Deal;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Deal.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Deal.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: DealStatus, default: DealStatus.Open }),
    __metadata("design:type", String)
], Deal.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pipeline', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Deal.prototype, "pipelineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Stage', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Deal.prototype, "stageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Contact' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Deal.prototype, "contactId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Deal.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Deal.prototype, "expectedCloseDate", void 0);
exports.Deal = Deal = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Deal);
exports.DealSchema = mongoose_1.SchemaFactory.createForClass(Deal);
exports.DealSchema.plugin(tenant_plugin_js_1.TenantPlugin);
exports.DealSchema.index({ organizationId: 1, pipelineId: 1, deletedAt: 1 });
exports.DealSchema.index({ organizationId: 1, stageId: 1, deletedAt: 1 });
//# sourceMappingURL=deal.schema.js.map