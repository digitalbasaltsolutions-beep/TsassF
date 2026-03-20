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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const whatsapp_service_js_1 = require("./whatsapp.service.js");
const audit_log_schema_js_1 = require("../../shared/database/audit-log.schema.js");
let NotificationsProcessor = NotificationsProcessor_1 = class NotificationsProcessor extends bullmq_1.WorkerHost {
    whatsappService;
    auditLogModel;
    logger = new common_1.Logger(NotificationsProcessor_1.name);
    constructor(whatsappService, auditLogModel) {
        super();
        this.whatsappService = whatsappService;
        this.auditLogModel = auditLogModel;
    }
    async process(job) {
        this.logger.log(`Processing job ${job.id} of type ${job.name}...`);
        switch (job.name) {
            case 'send-whatsapp':
                const { phone, message } = job.data;
                return this.whatsappService.send(phone, message);
            case 'send-email':
                this.logger.log(`[Email Service] Sending email to ${job.data.to} with subject: ${job.data.subject}`);
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true };
            case 'track-analytics':
                try {
                    const { organizationId, type, metadata, userId } = job.data;
                    await this.auditLogModel.create({
                        organizationId: new mongoose_2.Types.ObjectId(organizationId),
                        event: type,
                        metadata,
                        userId: userId ? new mongoose_2.Types.ObjectId(userId) : undefined
                    });
                    return { success: true };
                }
                catch (e) {
                    this.logger.error(`Failed to save audit log: ${e.message}`);
                    return { success: false };
                }
            default:
                this.logger.warn(`Unknown job type: ${job.name}`);
        }
    }
};
exports.NotificationsProcessor = NotificationsProcessor;
exports.NotificationsProcessor = NotificationsProcessor = NotificationsProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('notifications'),
    __param(1, (0, mongoose_1.InjectModel)(audit_log_schema_js_1.AuditLog.name)),
    __metadata("design:paramtypes", [whatsapp_service_js_1.WhatsAppService,
        mongoose_2.Model])
], NotificationsProcessor);
//# sourceMappingURL=notifications.processor.js.map