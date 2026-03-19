import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './schemas/contact.schema';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(@InjectModel(Contact.name) private contactModel: Model<Contact>) {}

  async sendMessage(contactId: string, message: string) {
    const contact = await this.contactModel.findById(contactId);
    if (!contact) throw new Error('Contact not found');

    // MOCK TWILIO/META WHATSAPP API INTEGRATION
    this.logger.log(`[WHATSAPP MOCK] Sending message to ${contact.name} (${contact.phone || 'No phone'}): "${message}"`);
    
    // In production, insert Axios call to Twilio/WhatsApp Graph API here:
    // await axios.post('https://graph.facebook.com/v17.0/PHONE_NUMBER_ID/messages', { ... });

    return { success: true, fakeMessageId: `wamid.HBgL${Math.floor(Math.random() * 100000)}` };
  }
}
