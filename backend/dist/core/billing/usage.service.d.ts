import { Model } from 'mongoose';
import { Subscription } from './schemas/subscription.schema.js';
import { Contact } from '../../modules/crm/schemas/contact.schema.js';
import { Deal } from '../../modules/crm/schemas/deal.schema.js';
import { Pipeline } from '../../modules/crm/schemas/pipeline.schema.js';
import { Membership } from '../organizations/schemas/membership.schema.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { RedisService } from '../../shared/redis/redis.service.js';
export declare class UsageService {
    private subModel;
    private contactModel;
    private dealModel;
    private pipelineModel;
    private membershipModel;
    private notificationsService;
    private redisService;
    constructor(subModel: Model<Subscription>, contactModel: Model<Contact>, dealModel: Model<Deal>, pipelineModel: Model<Pipeline>, membershipModel: Model<Membership>, notificationsService: NotificationsService, redisService: RedisService);
    getUsage(organizationId: string): Promise<any>;
    checkLimit(organizationId: string, type: 'contacts' | 'deals' | 'members' | 'pipelines'): Promise<boolean>;
}
