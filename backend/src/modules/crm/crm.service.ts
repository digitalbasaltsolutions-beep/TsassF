import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact } from './schemas/contact.schema';
import { Deal, DealStatus } from './schemas/deal.schema';
import { Activity, ActivityType } from './schemas/activity.schema';

@Injectable()
export class CrmService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @InjectModel(Deal.name) private dealModel: Model<Deal>,
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
  ) {}

  // --- Contacts ---
  async createContact(data: any): Promise<Contact> {
    return this.contactModel.create(data);
  }

  async getContacts(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }

  // --- Deals ---
  async createDeal(data: any): Promise<Deal> {
    return this.dealModel.create(data);
  }

  async getDeals(): Promise<Deal[]> {
    return this.dealModel.find().populate('contactId').exec();
  }

  async updateDealStage(dealId: string, pipelineStage: string): Promise<Deal> {
    const deal = await this.dealModel.findByIdAndUpdate(dealId, { pipelineStage }, { new: true }).exec();
    if (!deal) throw new NotFoundException('Deal not found');
    return deal;
  }

  // --- Activities ---
  async logActivity(data: any): Promise<Activity> {
    return this.activityModel.create(data);
  }

  async getActivitiesForDeal(dealId: string): Promise<Activity[]> {
    return this.activityModel.find({ dealId: new Types.ObjectId(dealId) }).exec();
  }

  async getActivitiesForContact(contactId: string): Promise<Activity[]> {
    return this.activityModel.find({ contactId: new Types.ObjectId(contactId) }).exec();
  }
}
