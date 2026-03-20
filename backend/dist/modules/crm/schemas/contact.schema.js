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
exports.ContactSchema = exports.Contact = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_js_1 = require("../../../shared/database/base.schema.js");
const tenant_plugin_js_1 = require("../../../shared/database/tenant.plugin.js");
let Contact = class Contact extends base_schema_js_1.BaseDocument {
    firstName;
    lastName;
    email;
    phone;
    company;
    tags;
    ownerId;
};
exports.Contact = Contact;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Contact.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Contact.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Contact.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Contact.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Contact.prototype, "company", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Contact.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Contact.prototype, "ownerId", void 0);
exports.Contact = Contact = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Contact);
exports.ContactSchema = mongoose_1.SchemaFactory.createForClass(Contact);
exports.ContactSchema.plugin(tenant_plugin_js_1.TenantPlugin);
exports.ContactSchema.index({ organizationId: 1, deletedAt: 1 });
exports.ContactSchema.index({ email: 1, organizationId: 1, deletedAt: 1 }, { unique: true });
//# sourceMappingURL=contact.schema.js.map