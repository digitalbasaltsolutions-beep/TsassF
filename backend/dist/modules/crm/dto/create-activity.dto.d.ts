import { ActivityType, ActivityStatus } from '../schemas/activity.schema.js';
export declare class CreateActivityDto {
    title: string;
    type: ActivityType;
    description?: string;
    status?: ActivityStatus;
    dueDate?: string;
    contactId?: string;
    dealId?: string;
    ownerId?: string;
}
