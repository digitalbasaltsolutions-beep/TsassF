import { CrmService } from './crm.service';
export declare class CrmController {
    private readonly crmService;
    constructor(crmService: CrmService);
    createContact(data: any): Promise<import("./schemas/contact.schema").Contact>;
    getContacts(): Promise<import("./schemas/contact.schema").Contact[]>;
    createDeal(data: any): Promise<import("./schemas/deal.schema").Deal>;
    getDeals(): Promise<import("./schemas/deal.schema").Deal[]>;
    updateDealStage(id: string, pipelineStage: string): Promise<import("./schemas/deal.schema").Deal>;
    logActivity(data: any): Promise<import("./schemas/activity.schema").Activity>;
    getDealActivities(id: string): Promise<import("./schemas/activity.schema").Activity[]>;
}
