import { Injectable, NotFoundException, ConflictException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact } from './schemas/contact.schema.js';
import { Deal } from './schemas/deal.schema.js';
import { Activity } from './schemas/activity.schema.js';
import { Pipeline } from './schemas/pipeline.schema.js';
import { Stage } from './schemas/stage.schema.js';
import { Note } from './schemas/note.schema.js';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { OrganizationsService } from '../../core/organizations/organizations.service.js';
import { AnalyticsService } from '../../shared/analytics/analytics.service.js';
import { Role } from '../../shared/constants/roles.enum.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { CreateDealDto } from './dto/create-deal.dto.js';
import { CreatePipelineDto, CreateStageDto } from './dto/pipeline-stage.dto.js';
import { CreateActivityDto } from './dto/create-activity.dto.js';
import { CreateNoteDto } from './dto/create-note.dto.js';

@Injectable()
export class CrmService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @InjectModel(Deal.name) private dealModel: Model<Deal>,
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
    @InjectModel(Pipeline.name) private pipelineModel: Model<Pipeline>,
    @InjectModel(Stage.name) private stageModel: Model<Stage>,
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    @Inject(forwardRef(() => OrganizationsService))
    private organizationsService: OrganizationsService,
    private analyticsService: AnalyticsService,
  ) {}

  // Helper for Ownership Control
  private getVisibilityFilter(user: { userId: string, role: Role, organizationId: string }) {
    const isAdmin = [Role.Owner, Role.Admin, Role.SuperAdmin].includes(user.role);
    const filter: any = { organizationId: new Types.ObjectId(user.organizationId), deletedAt: null };
    if (!isAdmin) {
      filter.ownerId = new Types.ObjectId(user.userId);
    }
    return filter;
  }

  // --- Contacts ---
  async createContact(organizationId: string, data: CreateContactDto): Promise<Contact> {
    const contact = await this.contactModel.create({ ...data, organizationId: new Types.ObjectId(organizationId) });
    await this.analyticsService.trackEvent(organizationId, 'CONTACT_CREATED', { contactId: contact._id });
    return contact;
  }

  async getContacts(user: any, query: { search?: string, page?: number, limit?: number }) {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const filter = this.getVisibilityFilter(user);

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const [data, total] = await Promise.all([
      this.contactModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.contactModel.countDocuments(filter)
    ]);

    return { data, meta: { total, page, limit } };
  }

  async getContactById(organizationId: string, id: string): Promise<Contact | null> {
    return this.contactModel.findOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId), deletedAt: null }).exec();
  }

  async updateContact(organizationId: string, id: string, data: Partial<CreateContactDto>): Promise<Contact | null> {
    return this.contactModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: data },
      { new: true }
    ).exec();
  }

  async softDeleteContact(organizationId: string, contactId: string): Promise<void> {
    await this.contactModel.updateOne(
      { _id: new Types.ObjectId(contactId), organizationId: new Types.ObjectId(organizationId) },
      { deletedAt: new Date() }
    );
    await this.analyticsService.trackEvent(organizationId, 'CONTACT_DELETED', { contactId });
  }

  // --- Pipelines & Stages ---
  async createPipeline(organizationId: string, data: CreatePipelineDto): Promise<Pipeline> {
    return this.pipelineModel.create({ ...data, organizationId: new Types.ObjectId(organizationId) });
  }

  async getPipelines(organizationId: string): Promise<Pipeline[]> {
    return this.pipelineModel.find({ organizationId: new Types.ObjectId(organizationId) }).exec();
  }

  async updatePipeline(organizationId: string, id: string, data: Partial<CreatePipelineDto>): Promise<Pipeline | null> {
    return this.pipelineModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: data },
      { new: true }
    ).exec();
  }

  async deletePipeline(organizationId: string, id: string): Promise<void> {
    // Optionally: prevent deletion if deals exist
    await this.pipelineModel.deleteOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) });
  }

  async createStage(organizationId: string, data: CreateStageDto): Promise<Stage> {
    return this.stageModel.create({ ...data, organizationId: new Types.ObjectId(organizationId) });
  }

  async getStages(pipelineId: string): Promise<Stage[]> {
    return this.stageModel.find({ pipelineId: new Types.ObjectId(pipelineId) }).sort({ order: 1 }).exec();
  }

  async updateStage(organizationId: string, id: string, data: Partial<CreateStageDto>): Promise<Stage | null> {
    return this.stageModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: data },
      { new: true }
    ).exec();
  }

  async deleteStage(organizationId: string, id: string): Promise<void> {
    await this.stageModel.deleteOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) });
  }

  async reorderStages(organizationId: string, pipelineId: string, stageOrders: { id: string, order: number }[]): Promise<void> {
    const orgId = new Types.ObjectId(organizationId);
    const pipeId = new Types.ObjectId(pipelineId);
    
    const bulkOps = stageOrders.map(so => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(so.id), organizationId: orgId, pipelineId: pipeId },
        update: { $set: { order: so.order } }
      }
    }));

    await this.stageModel.bulkWrite(bulkOps);
  }

  // --- Deals ---
  async createDeal(organizationId: string, data: CreateDealDto): Promise<Deal> {
    const deal = await this.dealModel.create({ ...data, organizationId: new Types.ObjectId(organizationId) });
    await this.analyticsService.trackEvent(organizationId, 'DEAL_CREATED', { dealId: deal._id });
    return deal;
  }

  async getDeals(user: any, query: { pipelineId?: string, search?: string, page?: number, limit?: number }) {
    const { pipelineId, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const filter = this.getVisibilityFilter(user);

    if (pipelineId) filter.pipelineId = new Types.ObjectId(pipelineId);
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      this.dealModel.find(filter).populate('contactId').populate('stageId').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.dealModel.countDocuments(filter)
    ]);

    return { data, meta: { total, page, limit } };
  }

  async getDealById(organizationId: string, id: string): Promise<Deal | null> {
    return this.dealModel.findOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId), deletedAt: null }).populate('contactId').populate('stageId').exec();
  }

  async updateDeal(organizationId: string, id: string, data: Partial<CreateDealDto>): Promise<Deal | null> {
    return this.dealModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: data },
      { new: true }
    ).exec();
  }

  async deleteDeal(organizationId: string, id: string): Promise<void> {
    await this.dealModel.updateOne(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { deletedAt: new Date() }
    );
  }

  async moveDealStage(organizationId: string, dealId: string, stageId: string): Promise<Deal> {
    const targetStage = await this.stageModel.findById(stageId);
    if (!targetStage) throw new NotFoundException('Target stage not found');

    const deal = await this.dealModel.findOne({ 
      _id: new Types.ObjectId(dealId), 
      organizationId: new Types.ObjectId(organizationId) 
    });
    if (!deal) throw new NotFoundException('Deal not found');

    if (targetStage.pipelineId.toString() !== deal.pipelineId.toString()) {
      throw new ForbiddenException('Target stage does not belong to the current pipeline');
    }

    deal.stageId = targetStage._id as Types.ObjectId;
    const updatedDeal = await deal.save();

    await this.analyticsService.trackEvent(organizationId, 'DEAL_MOVED_STAGE', { 
      dealId: deal._id,
      stageId,
      pipelineId: deal.pipelineId
    });
    
    return updatedDeal;
  }

  // --- Activities & Timeline ---
  async logActivity(organizationId: string, data: CreateActivityDto): Promise<Activity> {
    const activity = await this.activityModel.create({ ...data, organizationId: new Types.ObjectId(organizationId) });
    await this.analyticsService.trackEvent(organizationId, 'ACTIVITY_CREATED', { activityId: activity._id });
    return activity;
  }

  async getActivities(organizationId: string, query: { contactId?: string, dealId?: string, page?: number, limit?: number }) {
    const { contactId, dealId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const filter: any = { organizationId: new Types.ObjectId(organizationId) };
    if (contactId) filter.contactId = new Types.ObjectId(contactId);
    if (dealId) filter.dealId = new Types.ObjectId(dealId);

    const [data, total] = await Promise.all([
      this.activityModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.activityModel.countDocuments(filter)
    ]);

    return { data, meta: { total, page, limit } };
  }

  async updateActivity(organizationId: string, id: string, data: Partial<CreateActivityDto>): Promise<Activity | null> {
    return this.activityModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: data },
      { new: true }
    ).exec();
  }

  async deleteActivity(organizationId: string, id: string): Promise<void> {
    await this.activityModel.deleteOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) });
  }

  async getTimeline(organizationId: string, contactId?: string, dealId?: string): Promise<any[]> {
    const orgId = new Types.ObjectId(organizationId);
    const filter: any = { organizationId: orgId };
    if (contactId) filter.contactId = new Types.ObjectId(contactId);
    if (dealId) filter.dealId = new Types.ObjectId(dealId);

    const [activities, notes] = await Promise.all([
      this.activityModel.find(filter).sort({ createdAt: -1 }).exec(),
      this.noteModel.find({ 
        organizationId: orgId, 
        linkedEntityId: contactId ? new Types.ObjectId(contactId) : new Types.ObjectId(dealId) 
      }).sort({ createdAt: -1 }).exec(),
    ]);

    const timeline = [
      ...activities.map(a => ({ ...a.toObject(), timelineType: 'activity' })),
      ...notes.map(n => ({ ...n.toObject(), timelineType: 'note' }))
    ];

    return timeline.sort((a: any, b: any) => (b.createdAt as any) - (a.createdAt as any));
  }

  // --- Notes ---
  async addNote(organizationId: string, data: CreateNoteDto): Promise<Note> {
    return this.noteModel.create({ ...data, organizationId: new Types.ObjectId(organizationId) });
  }

  async updateNote(organizationId: string, id: string, data: Partial<CreateNoteDto>): Promise<Note | null> {
    return this.noteModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: data },
      { new: true }
    ).exec();
  }

  async deleteNote(organizationId: string, id: string): Promise<void> {
    await this.noteModel.deleteOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) });
  }

  // --- Bulk Operations ---
  async bulkDeleteContacts(organizationId: string, contactIds: string[]): Promise<any> {
    const result = await this.contactModel.updateMany(
      { _id: { $in: contactIds.map(id => new Types.ObjectId(id)) }, organizationId: new Types.ObjectId(organizationId) },
      { deletedAt: new Date() }
    );
    await this.analyticsService.trackEvent(organizationId, 'BULK_ACTION_PERFORMED', { action: 'delete_contacts', count: contactIds.length });
    return result;
  }

  // --- Utilities ---
  async sendWhatsAppAsync(contactId: string, message: string) {
    const contact = await this.contactModel.findById(contactId);
    if (!contact) throw new NotFoundException('Contact not found');

    await this.notificationsQueue.add('send-whatsapp', {
      phone: contact.phone,
      message,
    });

    return { success: true, status: 'queued' };
  }

  // --- Team Members ---
  async getTeamMembers(organizationId: string) {
    return this.organizationsService.getMembers(organizationId);
  }

  async addTeamMember(organizationId: string, userId: string, role: any) {
    const existing = await this.organizationsService.getMembership(userId, organizationId);
    if (existing) throw new ConflictException('User is already a member of this organization');
    
    return this.organizationsService.addMember(organizationId, userId, role);
  }
}
