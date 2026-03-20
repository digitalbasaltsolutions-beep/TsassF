"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subscription_schema_1 = require("./schemas/subscription.schema");
const organizations_service_1 = require("../organizations/organizations.service");
const stripe_1 = __importDefault(require("stripe"));
let BillingService = BillingService_1 = class BillingService {
    subscriptionModel;
    organizationsService;
    stripe;
    logger = new common_1.Logger(BillingService_1.name);
    constructor(subscriptionModel, organizationsService) {
        this.subscriptionModel = subscriptionModel;
        this.organizationsService = organizationsService;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
            apiVersion: '2023-10-16',
        });
    }
    async getSubscriptionForOrg(organizationId) {
        const sub = await this.subscriptionModel.findOne({ organizationId: new mongoose_2.Types.ObjectId(organizationId) }).exec();
        if (!sub) {
            return this.subscriptionModel.create({
                organizationId: new mongoose_2.Types.ObjectId(organizationId),
                plan: subscription_schema_1.PlanType.Free,
                status: 'active',
            });
        }
        return sub;
    }
    async createCheckoutSession(organizationId, plan) {
        if (!process.env.STRIPE_SECRET_KEY) {
            this.logger.warn('No STRIPE_SECRET_KEY. Returning mock session URL.');
            return { url: `http://localhost:3000/dashboard?upgrade_mock=true&plan=${plan}` };
        }
        const priceMap = {
            [subscription_schema_1.PlanType.Free]: 0,
            [subscription_schema_1.PlanType.Pro]: 2900,
            [subscription_schema_1.PlanType.Enterprise]: 9900,
        };
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: `${plan} Plan` },
                        unit_amount: priceMap[plan] || 0,
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `http://localhost:3000/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/billing`,
            client_reference_id: organizationId,
        });
        return { url: session.url };
    }
    async handleStripeWebhook(signature, payload) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event;
        try {
            if (webhookSecret) {
                event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            }
            else {
                event = payload;
            }
        }
        catch (err) {
            this.logger.error(`Webhook signature verification failed`, err);
            throw err;
        }
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const orgId = session.client_reference_id;
                if (orgId) {
                    const sub = await this.getSubscriptionForOrg(orgId);
                    sub.stripeCustomerId = session.customer;
                    sub.stripeSubscriptionId = session.subscription;
                    sub.plan = subscription_schema_1.PlanType.Pro;
                    sub.status = 'active';
                    await sub.save();
                    this.logger.log(`Upgraded org ${orgId} to Pro via Stripe checkout.`);
                }
                break;
            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                await this.subscriptionModel.updateOne({ stripeSubscriptionId: subscription.id }, { plan: subscription_schema_1.PlanType.Free, status: 'canceled' });
                break;
            default:
                this.logger.debug(`Unhandled event type ${event.type}`);
        }
    }
    getPlans() {
        return [
            { id: subscription_schema_1.PlanType.Free, name: 'Free Plan', price: 0, limits: { contacts: 100 } },
            { id: subscription_schema_1.PlanType.Pro, name: 'Pro Plan', price: 29, limits: { contacts: 1000 } },
            { id: subscription_schema_1.PlanType.Enterprise, name: 'Enterprise Plan', price: 99, limits: { contacts: 10000 } },
        ];
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        organizations_service_1.OrganizationsService])
], BillingService);
//# sourceMappingURL=billing.service.js.map