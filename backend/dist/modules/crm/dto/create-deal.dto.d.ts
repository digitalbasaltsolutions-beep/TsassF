import { DealStatus } from '../schemas/deal.schema.js';
export declare class CreateDealDto {
    title: string;
    value?: number;
    status?: DealStatus;
    pipelineId: string;
    stageId: string;
    contactId?: string;
    ownerId?: string;
    expectedCloseDate?: string;
}
