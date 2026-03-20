import { Model } from 'mongoose';
import { Contact } from './schemas/contact.schema.js';
export declare class WhatsAppService {
    private contactModel;
    private readonly logger;
    constructor(contactModel: Model<Contact>);
    sendMessage(contactId: string, message: string): Promise<{
        success: boolean;
        fakeMessageId: string;
    }>;
}
