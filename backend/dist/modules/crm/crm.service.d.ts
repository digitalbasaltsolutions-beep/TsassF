import { Model } from 'mongoose';
import { Contact } from './schemas/contact.schema';
import { Deal } from './schemas/deal.schema';
import { Activity } from './schemas/activity.schema';
export declare class CrmService {
    private contactModel;
    private dealModel;
    private activityModel;
    constructor(contactModel: Model<Contact>, dealModel: Model<Deal>, activityModel: Model<Activity>);
    createContact(data: any): Promise<Contact>;
    getContacts(): Promise<Contact[]>;
    createDeal(data: any): Promise<Deal>;
    getDeals(): Promise<Deal[]>;
    updateDealStage(dealId: string, pipelineStage: string): Promise<Deal>;
    logActivity(data: any): Promise<Activity>;
    getActivitiesForDeal(dealId: string): Promise<Activity[]>;
    getActivitiesForContact(contactId: string): Promise<Activity[]>;
}
