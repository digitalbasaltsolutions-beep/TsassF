import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WhatsAppService } from './whatsapp.service.js';
import { AuditLog } from '../../shared/database/audit-log.schema.js';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly whatsappService: WhatsAppService,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}...`);
    
    switch (job.name) {
      case 'send-whatsapp':
        const { phone, message } = job.data;
        return this.whatsappService.send(phone, message);
        
      case 'send-email':
        this.logger.log(`[Email Service] Sending email to ${job.data.to} with subject: ${job.data.subject}`);
        // Simulate email send
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };

      case 'track-analytics':
        try {
          const { organizationId, type, metadata, userId } = job.data;
          await this.auditLogModel.create({
            organizationId: new Types.ObjectId(organizationId),
            event: type,
            metadata,
            userId: userId ? new Types.ObjectId(userId) : undefined
          });
          return { success: true };
        } catch (e) {
          this.logger.error(`Failed to save audit log: ${e.message}`);
          return { success: false };
        }
      
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }
}
