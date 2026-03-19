import { Model } from 'mongoose';
import { Subscription, PlanType } from './schemas/subscription.schema';
import { OrganizationsService } from '../organizations/organizations.service';
export declare class BillingService {
    private subscriptionModel;
    private organizationsService;
    constructor(subscriptionModel: Model<Subscription>, organizationsService: OrganizationsService);
    getSubscriptionForOrg(organizationId: string): Promise<Subscription>;
    upgradePlan(organizationId: string, plan: PlanType): Promise<Subscription>;
    getPlans(): {
        id: PlanType;
        name: string;
        price: number;
        limits: {
            contacts: number;
        };
    }[];
}
