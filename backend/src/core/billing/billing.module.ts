import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingService } from './billing.service.js';
import { BillingController } from './billing.controller.js';
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema.js';
import { OrganizationsModule } from '../organizations/organizations.module.js';
import { UsageService } from './usage.service.js';
import { Contact, ContactSchema } from '../../modules/crm/schemas/contact.schema.js';
import { Deal, DealSchema } from '../../modules/crm/schemas/deal.schema.js';
import { Pipeline, PipelineSchema } from '../../modules/crm/schemas/pipeline.schema.js';
import { Membership, MembershipSchema } from '../organizations/schemas/membership.schema.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Contact.name, schema: ContactSchema },
      { name: Deal.name, schema: DealSchema },
      { name: Pipeline.name, schema: PipelineSchema },
      { name: Membership.name, schema: MembershipSchema },
    ]),
    forwardRef(() => OrganizationsModule),
    NotificationsModule,
  ],
  controllers: [BillingController],
  providers: [BillingService, UsageService],
  exports: [BillingService, UsageService],
})
export class BillingModule {}
