import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CrmService } from './crm.service.js';
import { CrmController } from './crm.controller.js';
import { Contact, ContactSchema } from './schemas/contact.schema.js';
import { Deal, DealSchema } from './schemas/deal.schema.js';
import { Activity, ActivitySchema } from './schemas/activity.schema.js';
import { Pipeline, PipelineSchema } from './schemas/pipeline.schema.js';
import { Stage, StageSchema } from './schemas/stage.schema.js';
import { Note, NoteSchema } from './schemas/note.schema.js';
import { OrganizationsModule } from '../../core/organizations/organizations.module.js';
import { NotificationsModule } from '../../core/notifications/notifications.module.js';
import { BillingModule } from '../../core/billing/billing.module.js';
import { AnalyticsModule } from '../../shared/analytics/analytics.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema },
      { name: Deal.name, schema: DealSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Pipeline.name, schema: PipelineSchema },
      { name: Stage.name, schema: StageSchema },
      { name: Note.name, schema: NoteSchema },
    ]),
    forwardRef(() => OrganizationsModule),
    NotificationsModule,
    BillingModule,
    AnalyticsModule,
  ],
  controllers: [CrmController],
  providers: [CrmService],
  exports: [CrmService],
})
export class CrmModule {}
