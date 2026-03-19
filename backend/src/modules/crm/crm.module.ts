import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CrmService } from './crm.service';
import { CrmController } from './crm.controller';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { Deal, DealSchema } from './schemas/deal.schema';
import { Activity, ActivitySchema } from './schemas/activity.schema';
import { OrganizationsModule } from '../../core/organizations/organizations.module';
import { WhatsAppService } from './whatsapp.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema },
      { name: Deal.name, schema: DealSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    OrganizationsModule,
  ],
  controllers: [CrmController],
  providers: [CrmService, WhatsAppService],
  exports: [CrmService, WhatsAppService],
})
export class CrmModule {}
