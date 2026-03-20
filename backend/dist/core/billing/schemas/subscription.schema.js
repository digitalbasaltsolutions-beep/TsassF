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
exports.SubscriptionSchema = exports.Subscription = exports.PlanType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_1 = require("../../../shared/database/base.schema");
var PlanType;
(function (PlanType) {
    PlanType["Free"] = "Free";
    PlanType["Pro"] = "Pro";
    PlanType["Enterprise"] = "Enterprise";
})(PlanType || (exports.PlanType = PlanType = {}));
let Subscription = class Subscription extends base_schema_1.BaseDocument {
    plan;
    status;
    stripeCustomerId;
    stripeSubscriptionId;
    apiCallsUsage;
};
exports.Subscription = Subscription;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization', required: true, index: true, unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Subscription.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: PlanType, default: PlanType.Free }),
    __metadata("design:type", String)
], Subscription.prototype, "plan", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'active' }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Subscription.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Subscription.prototype, "stripeSubscriptionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Subscription.prototype, "apiCallsUsage", void 0);
exports.Subscription = Subscription = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Subscription);
exports.SubscriptionSchema = mongoose_1.SchemaFactory.createForClass(Subscription);
//# sourceMappingURL=subscription.schema.js.map