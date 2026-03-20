import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { WhatsAppService } from './whatsapp.service.js';
import { AuditLog } from '../../shared/database/audit-log.schema.js';
export declare class NotificationsProcessor extends WorkerHost {
    private readonly whatsappService;
    private auditLogModel;
    private readonly logger;
    constructor(whatsappService: WhatsAppService, auditLogModel: Model<AuditLog>);
    process(job: Job<any, any, string>): Promise<any>;
}
