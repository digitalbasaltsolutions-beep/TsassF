import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  async send(phone: string, message: string) {
    // MOCK WHATSAPP API INTEGRATION
    this.logger.log(`[WHATSAPP MOCK] Sending to ${phone}: "${message}"`);
    
    // Insert actual API calls here
    return { success: true, timestamp: new Date() };
  }
}
