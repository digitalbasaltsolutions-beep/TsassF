"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const organizations_service_js_1 = require("./organizations.service.js");
const organizations_controller_js_1 = require("./organizations.controller.js");
const organization_schema_js_1 = require("./schemas/organization.schema.js");
const membership_schema_js_1 = require("./schemas/membership.schema.js");
const crm_module_js_1 = require("../../modules/crm/crm.module.js");
let OrganizationsModule = class OrganizationsModule {
};
exports.OrganizationsModule = OrganizationsModule;
exports.OrganizationsModule = OrganizationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: organization_schema_js_1.Organization.name, schema: organization_schema_js_1.OrganizationSchema },
                { name: membership_schema_js_1.Membership.name, schema: membership_schema_js_1.MembershipSchema },
            ]),
            (0, common_1.forwardRef)(() => crm_module_js_1.CrmModule),
        ],
        controllers: [organizations_controller_js_1.OrganizationsController],
        providers: [organizations_service_js_1.OrganizationsService],
        exports: [organizations_service_js_1.OrganizationsService],
    })
], OrganizationsModule);
//# sourceMappingURL=organizations.module.js.map