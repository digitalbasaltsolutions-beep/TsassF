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
exports.ActivitySchema = exports.Activity = exports.ActivityStatus = exports.ActivityType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_js_1 = require("../../../shared/database/base.schema.js");
const tenant_plugin_js_1 = require("../../../shared/database/tenant.plugin.js");
var ActivityType;
(function (ActivityType) {
    ActivityType["Call"] = "Call";
    ActivityType["Meeting"] = "Meeting";
    ActivityType["Email"] = "Email";
    ActivityType["Task"] = "Task";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
var ActivityStatus;
(function (ActivityStatus) {
    ActivityStatus["Pending"] = "Pending";
    ActivityStatus["Done"] = "Done";
})(ActivityStatus || (exports.ActivityStatus = ActivityStatus = {}));
let Activity = class Activity extends base_schema_js_1.BaseDocument {
    title;
    type;
    description;
    status;
    dueDate;
    contactId;
    dealId;
    ownerId;
};
exports.Activity = Activity;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Activity.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ActivityType, required: true }),
    __metadata("design:type", String)
], Activity.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Activity.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ActivityStatus, default: ActivityStatus.Pending }),
    __metadata("design:type", String)
], Activity.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Activity.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Contact' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Activity.prototype, "contactId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Deal' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Activity.prototype, "dealId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Activity.prototype, "ownerId", void 0);
exports.Activity = Activity = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Activity);
exports.ActivitySchema = mongoose_1.SchemaFactory.createForClass(Activity);
exports.ActivitySchema.plugin(tenant_plugin_js_1.TenantPlugin);
exports.ActivitySchema.index({ organizationId: 1, dueDate: 1 });
//# sourceMappingURL=activity.schema.js.map