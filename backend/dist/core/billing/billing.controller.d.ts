import { BillingService } from './billing.service';
import { UsageService } from './usage.service';
import { PlanType } from './schemas/subscription.schema';
export declare class BillingController {
    private readonly billingService;
    private readonly usageService;
    constructor(billingService: BillingService, usageService: UsageService);
    getUsage(req: any): Promise<any>;
    getPlans(): {
        id: PlanType;
        name: string;
        price: number;
        limits: {
            contacts: number;
        };
    }[];
    getMySubscription(req: any): Promise<import("./schemas/subscription.schema").Subscription>;
    createCheckoutSession(req: any, plan: PlanType): Promise<{
        url: string | null;
    }>;
    handleWebhook(signature: string, payload: any): Promise<void>;
}
