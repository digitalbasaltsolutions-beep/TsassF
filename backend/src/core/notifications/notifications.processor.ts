import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { WhatsAppService } from './whatsapp.service';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private readonly whatsappService: WhatsAppService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}...`);
    
    switch (job.name) {
      case 'send-whatsapp':
        const { phone, message } = job.data;
        return this.whatsappService.send(phone, message);
      
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }
}
