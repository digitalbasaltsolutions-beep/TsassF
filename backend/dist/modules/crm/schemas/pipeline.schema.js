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
exports.PipelineSchema = exports.Pipeline = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const base_schema_js_1 = require("../../../shared/database/base.schema.js");
const tenant_plugin_js_1 = require("../../../shared/database/tenant.plugin.js");
let Pipeline = class Pipeline extends base_schema_js_1.BaseDocument {
    name;
    isActive;
};
exports.Pipeline = Pipeline;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pipeline.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Pipeline.prototype, "isActive", void 0);
exports.Pipeline = Pipeline = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Pipeline);
exports.PipelineSchema = mongoose_1.SchemaFactory.createForClass(Pipeline);
exports.PipelineSchema.plugin(tenant_plugin_js_1.TenantPlugin);
//# sourceMappingURL=pipeline.schema.js.map