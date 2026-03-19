import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscription, PlanType } from './schemas/subscription.schema';
import { OrganizationsService } from '../organizations/organizations.service';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private stripe: Stripe;
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    private organizationsService: OrganizationsService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2023-10-16' as any,
    });
  }

  async getSubscriptionForOrg(organizationId: string): Promise<Subscription> {
    const sub = await this.subscriptionModel.findOne({ organizationId: new Types.ObjectId(organizationId) }).exec();
    if (!sub) {
      return this.subscriptionModel.create({
        organizationId: new Types.ObjectId(organizationId),
        plan: PlanType.Free,
        status: 'active',
      });
    }
    return sub;
  }

  async createCheckoutSession(organizationId: string, plan: PlanType) {
    // Simulated behavior if no real Stripe keys are configured
    if (!process.env.STRIPE_SECRET_KEY) {
      this.logger.warn('No STRIPE_SECRET_KEY. Returning mock session URL.');
      return { url: `http://localhost:3000/dashboard?upgrade_mock=true&plan=${plan}` };
    }

    const priceMap: Record<PlanType, number> = {
      [PlanType.Free]: 0,
      [PlanType.Pro]: 2900,
      [PlanType.Enterprise]: 9900,
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
      client_reference_id: organizationId, // Link org id to the webhook
    });

    return { url: session.url };
  }

  async handleStripeWebhook(signature: string, payload: any) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      if (webhookSecret) {
        // Stripe requires raw buffer for signature verification. 
        // In local mock mode, we bypass strict validation for testing.
        event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      } else {
        event = payload; // Mock event
      }
    } catch (err) {
      this.logger.error(`Webhook signature verification failed`, err);
      throw err;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.client_reference_id;
        
        if (orgId) {
          const sub = await this.getSubscriptionForOrg(orgId);
          sub.stripeCustomerId = session.customer as string;
          sub.stripeSubscriptionId = session.subscription as string;
          sub.plan = PlanType.Pro; // Or parse from session metadata dynamically
          sub.status = 'active';
          await sub.save();
          this.logger.log(`Upgraded org ${orgId} to Pro via Stripe checkout.`);
        }
        break;
      
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await this.subscriptionModel.updateOne(
          { stripeSubscriptionId: subscription.id },
          { plan: PlanType.Free, status: 'canceled' }
        );
        break;

      default:
        this.logger.debug(`Unhandled event type ${event.type}`);
    }
  }

  getPlans() {
    return [
      { id: PlanType.Free, name: 'Free Plan', price: 0, limits: { contacts: 100 } },
      { id: PlanType.Pro, name: 'Pro Plan', price: 29, limits: { contacts: 1000 } },
      { id: PlanType.Enterprise, name: 'Enterprise Plan', price: 99, limits: { contacts: 10000 } },
    ];
  }
}
