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
exports.StageSchema = exports.Stage = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_js_1 = require("../../../shared/database/base.schema.js");
const tenant_plugin_js_1 = require("../../../shared/database/tenant.plugin.js");
let Stage = class Stage extends base_schema_js_1.BaseDocument {
    pipelineId;
    name;
    order;
    color;
};
exports.Stage = Stage;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pipeline', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Stage.prototype, "pipelineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Stage.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Stage.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#3b82f6' }),
    __metadata("design:type", String)
], Stage.prototype, "color", void 0);
exports.Stage = Stage = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Stage);
exports.StageSchema = mongoose_1.SchemaFactory.createForClass(Stage);
exports.StageSchema.plugin(tenant_plugin_js_1.TenantPlugin);
exports.StageSchema.index({ pipelineId: 1, order: 1 });
//# sourceMappingURL=stage.schema.js.map