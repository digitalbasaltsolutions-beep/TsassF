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
exports.ActivitySchema = exports.Activity = exports.ActivityType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_1 = require("../../../shared/database/base.schema");
var ActivityType;
(function (ActivityType) {
    ActivityType["Call"] = "Call";
    ActivityType["Meeting"] = "Meeting";
    ActivityType["Note"] = "Note";
    ActivityType["Email"] = "Email";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
let Activity = class Activity extends base_schema_1.BaseDocument {
    type;
    description;
    contactId;
    dealId;
};
exports.Activity = Activity;
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ActivityType, required: true }),
    __metadata("design:type", String)
], Activity.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Activity.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Contact' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Activity.prototype, "contactId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Deal' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Activity.prototype, "dealId", void 0);
exports.Activity = Activity = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Activity);
exports.ActivitySchema = mongoose_1.SchemaFactory.createForClass(Activity);
//# sourceMappingURL=activity.schema.js.map