"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const notifications_service_js_1 = require("./notifications.service.js");
const notifications_controller_js_1 = require("./notifications.controller.js");
const notification_schema_js_1 = require("./schemas/notification.schema.js");
const audit_log_schema_js_1 = require("../../shared/database/audit-log.schema.js");
const bullmq_1 = require("@nestjs/bullmq");
const whatsapp_service_js_1 = require("./whatsapp.service.js");
const notifications_processor_js_1 = require("./notifications.processor.js");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: notification_schema_js_1.Notification.name, schema: notification_schema_js_1.NotificationSchema },
                { name: audit_log_schema_js_1.AuditLog.name, schema: audit_log_schema_js_1.AuditLogSchema }
            ]),
            bullmq_1.BullModule.registerQueue({
                name: 'notifications',
            }),
        ],
        controllers: [notifications_controller_js_1.NotificationsController],
        providers: [notifications_service_js_1.NotificationsService, whatsapp_service_js_1.WhatsAppService, notifications_processor_js_1.NotificationsProcessor],
        exports: [notifications_service_js_1.NotificationsService, whatsapp_service_js_1.WhatsAppService, bullmq_1.BullModule],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map