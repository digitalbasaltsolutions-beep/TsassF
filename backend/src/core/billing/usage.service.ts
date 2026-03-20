import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscription, PlanType } from './schemas/subscription.schema.js';
import { Contact } from '../../modules/crm/schemas/contact.schema.js';
import { Deal } from '../../modules/crm/schemas/deal.schema.js';
import { Pipeline } from '../../modules/crm/schemas/pipeline.schema.js';
import { Membership } from '../organizations/schemas/membership.schema.js';
import { PLAN_LIMITS } from './constants/plan-limits.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class UsageService {
  constructor(
    @InjectModel(Subscription.name) private subModel: Model<Subscription>,
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @InjectModel(Deal.name) private dealModel: Model<Deal>,
    @InjectModel(Pipeline.name) private pipelineModel: Model<Pipeline>,
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
    private notificationsService: NotificationsService,
  ) {}

  async getUsage(organizationId: string) {
    const orgId = new Types.ObjectId(organizationId);
    const sub = await this.subModel.findOne({ organizationId: orgId }).exec();
    const plan = sub?.plan || PlanType.Free;

    const [contactsCount, dealsCount, membersCount, pipelinesCount] = await Promise.all([
      this.contactModel.countDocuments({ organizationId: orgId }),
      this.dealModel.countDocuments({ organizationId: orgId }),
      this.membershipModel.countDocuments({ organizationId: orgId }),
      this.pipelineModel.countDocuments({ organizationId: orgId }),
    ]);

    const limits = PLAN_LIMITS[plan];

    const isNearLimit = {
      contacts: contactsCount >= limits.contacts * 0.8,
      deals: dealsCount >= limits.deals * 0.8,
      members: membersCount >= limits.members * 0.8,
      pipelines: pipelinesCount >= (limits.pipelines || 5) * 0.8,
    };

    if (isNearLimit.contacts || isNearLimit.deals || isNearLimit.pipelines) {
      this.notificationsService.createNotification(
        organizationId,
        '⚠️ Usage Warning',
        'You have reached 80% of your current plan limits. Upgrade now to ensure uninterrupted service.',
        'billing'
      ).catch(() => {});
    }

    return {
      plan,
      usage: {
        contacts: contactsCount,
        deals: dealsCount,
        members: membersCount,
        pipelines: pipelinesCount,
      },
      limits,
      isNearLimit
    };
  }

  async checkLimit(organizationId: string, type: 'contacts' | 'deals' | 'members' | 'pipelines') {
    const stats = await this.getUsage(organizationId);
    const current = (stats.usage as any)[type];
    const limit = (stats.limits as any)[type] || Infinity;

    if (current >= limit) {
      throw new ForbiddenException(`You have reached the ${type} limit for your ${stats.plan} plan. Please upgrade to continue.`);
    }
    
    return true;
  }
}
