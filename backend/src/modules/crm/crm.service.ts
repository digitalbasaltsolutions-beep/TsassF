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
import { RedisService } from '../../shared/redis/redis.service.js';
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
    private redisService: RedisService,
  ) {}

  // Helper for Cache Keys
  private getCacheKey(organizationId: string, prefix: string) {
    return `crm:v1:${organizationId}:${prefix}`;
  }

  private async clearCrmCache(organizationId: string, types: string[] = ['contacts', 'deals', 'pipelines']) {
    // Clear wildcard patterns in background
    Promise.all(types.map(type => this.redisService.del(this.getCacheKey(organizationId, type))))
      .catch(err => console.error('Cache clear failed:', err));
  }

  // Helper for Background Analytics
  private async trackAnalyticsAsync(organizationId: string, type: string, userId?: string, metadata: any = {}) {
    await this.notificationsQueue.add('track-analytics', { 
      organizationId, 
      type, 
      userId,
      metadata, 
      timestamp: new Date() 
    });
  }

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
  async createContact(organizationId: string, userId: string, data: CreateContactDto): Promise<Contact> {
    const contact = await this.contactModel.create({ 
      ...data, 
      organizationId: new Types.ObjectId(organizationId),
      ownerId: data.ownerId || new Types.ObjectId(userId)
    });
    
    this.clearCrmCache(organizationId, ['contacts']);
    this.trackAnalyticsAsync(organizationId, 'CONTACT_CREATED', userId, { contactId: contact._id });
    return contact.toObject();
  }

  async getContacts(user: any, query: { search?: string, page?: number, limit?: number, showDeleted?: boolean }) {
    const limit = Number(query.limit) || 20;
    const page = Number(query.page) || 1;
    const filter: any = { organizationId: new Types.ObjectId(user.organizationId) };
    
    // Check Cache
    const cacheKey = this.getCacheKey(user.organizationId, `contacts:${JSON.stringify(query)}:${user.role}`);
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    if (query.showDeleted) {
      filter.deletedAt = { $ne: null };
    } else {
      filter.deletedAt = null;
    }

    const isAdmin = [Role.Owner, Role.Admin, Role.SuperAdmin].includes(user.role);
    if (!isAdmin) {
      filter.ownerId = new Types.ObjectId(user.userId);
    }

    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { company: { $regex: query.search, $options: 'i' } }
      ];
    }

    const [data, total] = await Promise.all([
      this.contactModel.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.contactModel.countDocuments(filter)
    ]);

    const result = { data, meta: { total, page, limit } };
    await this.redisService.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  async getContactById(organizationId: string, id: string): Promise<Contact | null> {
    return this.contactModel.findOne({ 
      _id: new Types.ObjectId(id), 
      organizationId: new Types.ObjectId(organizationId), 
      deletedAt: null 
    }).select('-__v').lean().exec() as Promise<Contact | null>;
  }

  async updateContact(organizationId: string, userId: string, id: string, data: Partial<CreateContactDto>): Promise<Contact | null> {
    const updated = await this.contactModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId), deletedAt: null },
      { $set: data },
      { new: true }
    ).lean().exec();
    
    if (updated) {
      this.clearCrmCache(organizationId, ['contacts']); // Clear cache asynchronously
      this.trackAnalyticsAsync(organizationId, 'CONTACT_UPDATED', userId, { contactId: id });
    }
    return updated as Contact | null;
  }

  async softDeleteContact(organizationId: string, userId: string, contactId: string): Promise<void> {
    await this.contactModel.updateOne(
      { _id: new Types.ObjectId(contactId), organizationId: new Types.ObjectId(organizationId) },
      { $set: { deletedAt: new Date() } }
    );
    this.clearCrmCache(organizationId, ['contacts']); // Clear cache asynchronously
    this.trackAnalyticsAsync(organizationId, 'CONTACT_DELETED', userId, { contactId });
  }

  async restoreContact(organizationId: string, userId: string, contactId: string): Promise<void> {
    await this.contactModel.updateOne(
      { _id: new Types.ObjectId(contactId), organizationId: new Types.ObjectId(organizationId) },
      { $set: { deletedAt: null } }
    );
    this.clearCrmCache(organizationId, ['contacts']); // Clear cache asynchronously
    this.trackAnalyticsAsync(organizationId, 'CONTACT_RESTORED', userId, { contactId });
  }

  async bulkCreateContacts(organizationId: string, userId: string, contacts: CreateContactDto[]): Promise<any> {
    const orgId = new Types.ObjectId(organizationId);
    const ownerId = new Types.ObjectId(userId);
    
    const docs = contacts.map(c => ({
      ...c,
      organizationId: orgId,
      ownerId: c.ownerId || ownerId
    }));

    const result = await this.contactModel.insertMany(docs);
    this.clearCrmCache(organizationId, ['contacts']); // Clear cache asynchronously
    this.trackAnalyticsAsync(organizationId, 'BULK_ACTION_PERFORMED', userId, { action: 'bulk_create_contacts', count: docs.length });
    return result;
  }

  // --- Pipelines & Stages ---
  async createPipeline(organizationId: string, userId: string, data: CreatePipelineDto): Promise<Pipeline> {
    const pipeline = await this.pipelineModel.create({ 
      ...data, 
      organizationId: new Types.ObjectId(organizationId),
      createdBy: new Types.ObjectId(userId)
    });
    this.redisService.del(this.getCacheKey(organizationId, 'pipelines')).catch(err => console.error('Cache clear failed:', err)); // Clear cache asynchronously
    this.trackAnalyticsAsync(organizationId, 'PIPELINE_CREATED', userId, { pipelineId: pipeline._id });
    return pipeline.toObject();
  }

  async getPipelines(organizationId: string): Promise<Pipeline[]> {
    const cacheKey = this.getCacheKey(organizationId, 'pipelines');
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.pipelineModel.find({ 
      organizationId: new Types.ObjectId(organizationId), 
      deletedAt: null 
    }).select('-__v').lean().exec();
    
    await this.redisService.setex(cacheKey, 3600, JSON.stringify(data));
    return data as Pipeline[];
  }

  async updatePipeline(organizationId: string, userId: string, id: string, data: Partial<CreatePipelineDto>): Promise<Pipeline | null> {
    const updated = await this.pipelineModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId), deletedAt: null },
      { $set: data },
      { new: true }
    ).lean().exec();
    
    if (updated) {
      this.redisService.del(this.getCacheKey(organizationId, 'pipelines')).catch(err => console.error('Cache clear failed:', err)); // Clear cache asynchronously
      this.trackAnalyticsAsync(organizationId, 'PIPELINE_UPDATED', userId, { pipelineId: id });
    }
    return updated as Pipeline | null;
  }

  async deletePipeline(organizationId: string, userId: string, id: string): Promise<void> {
    await this.pipelineModel.updateOne(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: { deletedAt: new Date() } }
    );
    this.redisService.del(this.getCacheKey(organizationId, 'pipelines')).catch(err => console.error('Cache clear failed:', err)); // Clear cache asynchronously
    this.trackAnalyticsAsync(organizationId, 'PIPELINE_DELETED', userId, { pipelineId: id });
  }

  async createStage(organizationId: string, userId: string, data: CreateStageDto): Promise<Stage> {
    const stage = await this.stageModel.create({ 
      ...data, 
      organizationId: new Types.ObjectId(organizationId) 
    });
    this.redisService.del(this.getCacheKey(organizationId, `stages:${data.pipelineId}`)).catch(err => console.error('Cache clear failed:', err)); // Clear cache asynchronously
    this.trackAnalyticsAsync(organizationId, 'STAGE_CREATED', userId, { stageId: stage._id, pipelineId: data.pipelineId });
    return stage.toObject();
  }

  async getStages(pipelineId: string): Promise<Stage[]> {
    const cacheKey = `crm:v1:stages:${pipelineId}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.stageModel.find({ 
      pipelineId: new Types.ObjectId(pipelineId),
      deletedAt: null
    }).sort({ order: 1 }).select('-__v').lean().exec();
    
    await this.redisService.setex(cacheKey, 3600, JSON.stringify(data));
    return data as Stage[];
  }

  async updateStage(organizationId: string, userId: string, id: string, data: Partial<CreateStageDto>): Promise<Stage | null> {
    const updated = await this.stageModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId), deletedAt: null },
      { $set: data },
      { new: true }
    ).lean().exec();
    
    if (updated) {
      await this.redisService.del(this.getCacheKey(organizationId, `stages:${updated.pipelineId}`));
      this.trackAnalyticsAsync(organizationId, 'STAGE_UPDATED', userId, { stageId: id });
    }
    return updated as Stage | null;
  }

  async deleteStage(organizationId: string, userId: string, id: string): Promise<void> {
    const stage = await this.stageModel.findOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) });
    if (stage) {
      await this.stageModel.updateOne(
        { _id: new Types.ObjectId(id) },
        { $set: { deletedAt: new Date() } }
      );
      await this.redisService.del(this.getCacheKey(organizationId, `stages:${stage.pipelineId}`));
      this.trackAnalyticsAsync(organizationId, 'STAGE_DELETED', userId, { stageId: id });
    }
  }

  // --- Deals ---
  async createDeal(organizationId: string, userId: string, data: CreateDealDto): Promise<Deal> {
    const deal = await this.dealModel.create({ 
      ...data, 
      organizationId: new Types.ObjectId(organizationId),
      ownerId: data.ownerId || new Types.ObjectId(userId)
    });
    this.clearCrmCache(organizationId, ['deals']);
    this.trackAnalyticsAsync(organizationId, 'DEAL_CREATED', userId, { dealId: deal._id });
    return deal.toObject();
  }

  async getDeals(user: any, query: { pipelineId?: string, search?: string, page?: number, limit?: number }) {
    const limit = Number(query.limit) || 50;
    const page = Number(query.page) || 1;
    const filter = this.getVisibilityFilter(user);

    // Cache lookup
    const cacheKey = this.getCacheKey(user.organizationId, `deals:${JSON.stringify(query)}:${user.role}`);
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    if (query.pipelineId) filter.pipelineId = new Types.ObjectId(query.pipelineId);
    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      this.dealModel.find(filter)
        .populate({ path: 'contactId', select: 'firstName lastName email' })
        .populate({ path: 'stageId', select: 'name order' })
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.dealModel.countDocuments(filter)
    ]);

    const result = { data, meta: { total, page, limit } };
    await this.redisService.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  async getDealById(organizationId: string, id: string): Promise<Deal | null> {
    return this.dealModel.findOne({ 
      _id: new Types.ObjectId(id), 
      organizationId: new Types.ObjectId(organizationId), 
      deletedAt: null 
    }).populate('contactId').populate('stageId').select('-__v').lean().exec() as Promise<Deal | null>;
  }

  async updateDeal(organizationId: string, userId: string, id: string, data: Partial<CreateDealDto>): Promise<Deal | null> {
    const updated = await this.dealModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId), deletedAt: null },
      { $set: data },
      { new: true }
    ).lean().exec();
    
    if (updated) {
      this.clearCrmCache(organizationId, ['deals']);
      this.trackAnalyticsAsync(organizationId, 'DEAL_UPDATED', userId, { dealId: id });
    }
    return updated as Deal | null;
  }

  async deleteDeal(organizationId: string, userId: string, id: string): Promise<void> {
    await this.dealModel.updateOne(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: { deletedAt: new Date() } }
    );
    this.clearCrmCache(organizationId, ['deals']);
    this.trackAnalyticsAsync(organizationId, 'DEAL_DELETED', userId, { dealId: id });
  }

  async restoreDeal(organizationId: string, userId: string, id: string): Promise<void> {
    await this.dealModel.updateOne(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: { deletedAt: null } }
    );
    this.clearCrmCache(organizationId, ['deals']);
    this.trackAnalyticsAsync(organizationId, 'DEAL_RESTORED', userId, { dealId: id });
  }

  async moveDealStage(organizationId: string, userId: string, dealId: string, stageId: string): Promise<Deal> {
    const targetStage = await this.stageModel.findById(stageId);
    if (!targetStage || targetStage.deletedAt) throw new NotFoundException('Target stage not found');

    const deal = await this.dealModel.findOne({ 
      _id: new Types.ObjectId(dealId), 
      organizationId: new Types.ObjectId(organizationId),
      deletedAt: null
    });
    if (!deal) throw new NotFoundException('Deal not found');

    if (targetStage.pipelineId.toString() !== deal.pipelineId.toString()) {
      throw new ForbiddenException('Target stage does not belong to the current pipeline');
    }

    const updated = await this.dealModel.findByIdAndUpdate(dealId, { $set: { stageId: targetStage._id } }, { new: true }).lean().exec();

    this.clearCrmCache(organizationId, ['deals']);
    this.trackAnalyticsAsync(organizationId, 'DEAL_MOVED_STAGE', userId, { 
      dealId: deal._id,
      stageId,
      pipelineId: deal.pipelineId
    });
    
    return updated as Deal;
  }

  async reorderStages(organizationId: string, userId: string, pipelineId: string, stageOrders: { id: string, order: number }[]): Promise<void> {
    const orgId = new Types.ObjectId(organizationId);
    const pipeId = new Types.ObjectId(pipelineId);
    
    const bulkOps = stageOrders.map(so => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(so.id), organizationId: orgId, pipelineId: pipeId },
        update: { $set: { order: so.order } }
      }
    }));

    await this.stageModel.bulkWrite(bulkOps);
    await this.redisService.del(this.getCacheKey(organizationId, `stages:${pipelineId}`));
    this.trackAnalyticsAsync(organizationId, 'STAGES_REORDERED', userId, { pipelineId });
  }

  async bulkMoveDealsStage(organizationId: string, userId: string, dealIds: string[], targetStageId: string): Promise<any> {
    const orgId = new Types.ObjectId(organizationId);
    const stageId = new Types.ObjectId(targetStageId);

    const result = await this.dealModel.updateMany(
      { _id: { $in: dealIds.map(id => new Types.ObjectId(id)) }, organizationId: orgId },
      { $set: { stageId } }
    );

    this.clearCrmCache(organizationId, ['deals']);
    this.trackAnalyticsAsync(organizationId, 'BULK_ACTION_PERFORMED', userId, { 
      action: 'move_deals', 
      count: dealIds.length,
      targetStageId
    });
    
    return result;
  }

  // --- Activities ---
  async logActivity(organizationId: string, userId: string, data: CreateActivityDto): Promise<Activity> {
    const activity = await this.activityModel.create({ 
      ...data, 
      organizationId: new Types.ObjectId(organizationId),
      ownerId: new Types.ObjectId(userId)
    });
    this.trackAnalyticsAsync(organizationId, 'ACTIVITY_CREATED', userId, { activityId: activity._id });
    return activity.toObject();
  }

  async getActivities(organizationId: string, query: { contactId?: string, dealId?: string, page?: number, limit?: number }) {
    const limit = Number(query.limit) || 20;
    const page = Number(query.page) || 1;
    const filter: any = { organizationId: new Types.ObjectId(organizationId), deletedAt: null };
    
    if (query.contactId) filter.contactId = new Types.ObjectId(query.contactId);
    if (query.dealId) filter.dealId = new Types.ObjectId(query.dealId);

    const [data, total] = await Promise.all([
      this.activityModel.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.activityModel.countDocuments(filter)
    ]);

    return { data, meta: { total, page, limit } };
  }

  async updateActivity(organizationId: string, userId: string, id: string, data: Partial<CreateActivityDto>): Promise<Activity | null> {
    const updated = await this.activityModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId), deletedAt: null },
      { $set: data },
      { new: true }
    ).lean().exec();
    
    if (updated) this.trackAnalyticsAsync(organizationId, 'ACTIVITY_UPDATED', userId, { activityId: id });
    return updated as Activity | null;
  }

  async deleteActivity(organizationId: string, userId: string, id: string): Promise<void> {
    await this.activityModel.updateOne(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: { deletedAt: new Date() } }
    );
    this.trackAnalyticsAsync(organizationId, 'ACTIVITY_DELETED', userId, { activityId: id });
  }

  // --- Notes ---
  async addNote(organizationId: string, userId: string, data: CreateNoteDto): Promise<Note> {
    const note = await this.noteModel.create({ 
      ...data, 
      organizationId: new Types.ObjectId(organizationId),
      ownerId: new Types.ObjectId(userId)
    });
    this.trackAnalyticsAsync(organizationId, 'NOTE_CREATED', userId, { noteId: note._id });
    return note.toObject();
  }

  async getNotes(organizationId: string, query: { linkedEntityId: string, page?: number, limit?: number }) {
    const limit = Number(query.limit) || 20;
    const page = Number(query.page) || 1;
    const filter = { 
      organizationId: new Types.ObjectId(organizationId), 
      linkedEntityId: new Types.ObjectId(query.linkedEntityId),
      deletedAt: null 
    };

    const [data, total] = await Promise.all([
      this.noteModel.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.noteModel.countDocuments(filter)
    ]);

    return { data, meta: { total, page, limit } };
  }

  async updateNote(organizationId: string, userId: string, id: string, data: Partial<CreateNoteDto>): Promise<Note | null> {
    const updated = await this.noteModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId), deletedAt: null },
      { $set: data },
      { new: true }
    ).lean().exec();
    
    if (updated) this.trackAnalyticsAsync(organizationId, 'NOTE_UPDATED', userId, { noteId: id });
    return updated as Note | null;
  }

  async deleteNote(organizationId: string, userId: string, id: string): Promise<void> {
    await this.noteModel.updateOne(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: { deletedAt: new Date() } }
    );
    this.trackAnalyticsAsync(organizationId, 'NOTE_DELETED', userId, { noteId: id });
  }

  // --- Timeline (Unified Notes + Activities) ---
  async getTimeline(organizationId: string, contactId?: string, dealId?: string): Promise<any[]> {
    const orgId = new Types.ObjectId(organizationId);
    const filter: any = { organizationId: orgId, deletedAt: null };
    if (contactId) filter.contactId = new Types.ObjectId(contactId);
    if (dealId) filter.dealId = new Types.ObjectId(dealId);

    const [activities, notes] = await Promise.all([
      this.activityModel.find(filter).sort({ createdAt: -1 }).limit(50).lean().exec(),
      this.noteModel.find({ 
        organizationId: orgId, 
        linkedEntityId: contactId ? new Types.ObjectId(contactId) : (dealId ? new Types.ObjectId(dealId) : null),
        deletedAt: null
      }).sort({ createdAt: -1 }).limit(50).lean().exec(),
    ]);

    const timeline = [
      ...activities.map(a => ({ ...a, timelineType: 'activity' })),
      ...notes.map(n => ({ ...n, timelineType: 'note' }))
    ];

    return timeline.sort((a: any, b: any) => (b.createdAt as any) - (a.createdAt as any));
  }

  // --- Bulk Operations ---
  async bulkDeleteContacts(organizationId: string, userId: string, contactIds: string[]): Promise<any> {
    const result = await this.contactModel.updateMany(
      { _id: { $in: contactIds.map(id => new Types.ObjectId(id)) }, organizationId: new Types.ObjectId(organizationId) },
      { $set: { deletedAt: new Date() } }
    );
    this.trackAnalyticsAsync(organizationId, 'BULK_ACTION_PERFORMED', userId, { action: 'delete_contacts', count: contactIds.length });
    return result;
  }

  // --- Utilities ---
  async sendWhatsAppAsync(contactId: string, message: string) {
    const contact = await this.contactModel.findById(contactId);
    if (!contact || contact.deletedAt) throw new NotFoundException('Contact not found');

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

