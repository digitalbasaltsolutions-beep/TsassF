import { Model } from 'mongoose';
import { Subscription, PlanType } from './schemas/subscription.schema';
import { OrganizationsService } from '../organizations/organizations.service';
export declare class BillingService {
    private subscriptionModel;
    private organizationsService;
    private stripe;
    private readonly logger;
    constructor(subscriptionModel: Model<Subscription>, organizationsService: OrganizationsService);
    getSubscriptionForOrg(organizationId: string): Promise<Subscription>;
    createCheckoutSession(organizationId: string, plan: PlanType): Promise<{
        url: string | null;
    }>;
    handleStripeWebhook(signature: string, payload: any): Promise<void>;
    getPlans(): {
        id: PlanType;
        name: string;
        price: number;
        limits: {
            contacts: number;
        };
    }[];
}
