import { BillingService } from './billing.service';
import { PlanType } from './schemas/subscription.schema';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    getPlans(): {
        id: PlanType;
        name: string;
        price: number;
        limits: {
            contacts: number;
        };
    }[];
    getMySubscription(req: any): Promise<import("./schemas/subscription.schema").Subscription>;
    upgradePlan(req: any, plan: PlanType): Promise<import("./schemas/subscription.schema").Subscription>;
}
