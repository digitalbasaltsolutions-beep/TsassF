"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const billing_service_js_1 = require("./billing.service.js");
const billing_controller_js_1 = require("./billing.controller.js");
const subscription_schema_js_1 = require("./schemas/subscription.schema.js");
const organizations_module_js_1 = require("../organizations/organizations.module.js");
const usage_service_js_1 = require("./usage.service.js");
const contact_schema_js_1 = require("../../modules/crm/schemas/contact.schema.js");
const deal_schema_js_1 = require("../../modules/crm/schemas/deal.schema.js");
const pipeline_schema_js_1 = require("../../modules/crm/schemas/pipeline.schema.js");
const membership_schema_js_1 = require("../organizations/schemas/membership.schema.js");
const notifications_module_js_1 = require("../notifications/notifications.module.js");
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: subscription_schema_js_1.Subscription.name, schema: subscription_schema_js_1.SubscriptionSchema },
                { name: contact_schema_js_1.Contact.name, schema: contact_schema_js_1.ContactSchema },
                { name: deal_schema_js_1.Deal.name, schema: deal_schema_js_1.DealSchema },
                { name: pipeline_schema_js_1.Pipeline.name, schema: pipeline_schema_js_1.PipelineSchema },
                { name: membership_schema_js_1.Membership.name, schema: membership_schema_js_1.MembershipSchema },
            ]),
            (0, common_1.forwardRef)(() => organizations_module_js_1.OrganizationsModule),
            notifications_module_js_1.NotificationsModule,
        ],
        controllers: [billing_controller_js_1.BillingController],
        providers: [billing_service_js_1.BillingService, usage_service_js_1.UsageService],
        exports: [billing_service_js_1.BillingService, usage_service_js_1.UsageService],
    })
], BillingModule);
//# sourceMappingURL=billing.module.js.map