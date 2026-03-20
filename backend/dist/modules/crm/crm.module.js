"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const crm_service_js_1 = require("./crm.service.js");
const crm_controller_js_1 = require("./crm.controller.js");
const contact_schema_js_1 = require("./schemas/contact.schema.js");
const deal_schema_js_1 = require("./schemas/deal.schema.js");
const activity_schema_js_1 = require("./schemas/activity.schema.js");
const pipeline_schema_js_1 = require("./schemas/pipeline.schema.js");
const stage_schema_js_1 = require("./schemas/stage.schema.js");
const note_schema_js_1 = require("./schemas/note.schema.js");
const organizations_module_js_1 = require("../../core/organizations/organizations.module.js");
const notifications_module_js_1 = require("../../core/notifications/notifications.module.js");
const billing_module_js_1 = require("../../core/billing/billing.module.js");
const analytics_module_js_1 = require("../../shared/analytics/analytics.module.js");
let CrmModule = class CrmModule {
};
exports.CrmModule = CrmModule;
exports.CrmModule = CrmModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: contact_schema_js_1.Contact.name, schema: contact_schema_js_1.ContactSchema },
                { name: deal_schema_js_1.Deal.name, schema: deal_schema_js_1.DealSchema },
                { name: activity_schema_js_1.Activity.name, schema: activity_schema_js_1.ActivitySchema },
                { name: pipeline_schema_js_1.Pipeline.name, schema: pipeline_schema_js_1.PipelineSchema },
                { name: stage_schema_js_1.Stage.name, schema: stage_schema_js_1.StageSchema },
                { name: note_schema_js_1.Note.name, schema: note_schema_js_1.NoteSchema },
            ]),
            (0, common_1.forwardRef)(() => organizations_module_js_1.OrganizationsModule),
            notifications_module_js_1.NotificationsModule,
            billing_module_js_1.BillingModule,
            analytics_module_js_1.AnalyticsModule,
        ],
        controllers: [crm_controller_js_1.CrmController],
        providers: [crm_service_js_1.CrmService],
        exports: [crm_service_js_1.CrmService],
    })
], CrmModule);
//# sourceMappingURL=crm.module.js.map