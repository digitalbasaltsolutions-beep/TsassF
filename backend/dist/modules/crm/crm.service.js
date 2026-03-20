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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const contact_schema_js_1 = require("./schemas/contact.schema.js");
const deal_schema_js_1 = require("./schemas/deal.schema.js");
const activity_schema_js_1 = require("./schemas/activity.schema.js");
const pipeline_schema_js_1 = require("./schemas/pipeline.schema.js");
const stage_schema_js_1 = require("./schemas/stage.schema.js");
const note_schema_js_1 = require("./schemas/note.schema.js");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const organizations_service_js_1 = require("../../core/organizations/organizations.service.js");
const analytics_service_js_1 = require("../../shared/analytics/analytics.service.js");
const redis_service_js_1 = require("../../shared/redis/redis.service.js");
const roles_enum_js_1 = require("../../shared/constants/roles.enum.js");
let CrmService = class CrmService {
    contactModel;
    dealModel;
    activityModel;
    pipelineModel;
    stageModel;
    noteModel;
    notificationsQueue;
    organizationsService;
    analyticsService;
    redisService;
    constructor(contactModel, dealModel, activityModel, pipelineModel, stageModel, noteModel, notificationsQueue, organizationsService, analyticsService, redisService) {
        this.contactModel = contactModel;
        this.dealModel = dealModel;
        this.activityModel = activityModel;
        this.pipelineModel = pipelineModel;
        this.stageModel = stageModel;
        this.noteModel = noteModel;
        this.notificationsQueue = notificationsQueue;
        this.organizationsService = organizationsService;
        this.analyticsService = analyticsService;
        this.redisService = redisService;
    }
    getCacheKey(organizationId, prefix) {
        return `crm:v1:${organizationId}:${prefix}`;
    }
    async trackAnalyticsAsync(organizationId, type, userId, metadata = {}) {
        await this.notificationsQueue.add('track-analytics', {
            organizationId,
            type,
            userId,
            metadata,
            timestamp: new Date()
        });
    }
    getVisibilityFilter(user) {
        const isAdmin = [roles_enum_js_1.Role.Owner, roles_enum_js_1.Role.Admin, roles_enum_js_1.Role.SuperAdmin].includes(user.role);
        const filter = { organizationId: new mongoose_2.Types.ObjectId(user.organizationId), deletedAt: null };
        if (!isAdmin) {
            filter.ownerId = new mongoose_2.Types.ObjectId(user.userId);
        }
        return filter;
    }
    async createContact(organizationId, userId, data) {
        const contact = await this.contactModel.create({
            ...data,
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            ownerId: data.ownerId || new mongoose_2.Types.ObjectId(userId)
        });
        this.trackAnalyticsAsync(organizationId, 'CONTACT_CREATED', userId, { contactId: contact._id });
        return contact.toObject();
    }
    async getContacts(user, query) {
        const limit = Number(query.limit) || 20;
        const page = Number(query.page) || 1;
        const filter = this.getVisibilityFilter(user);
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
        return { data, meta: { total, page, limit } };
    }
    async getContactById(organizationId, id) {
        return this.contactModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            deletedAt: null
        }).select('-__v').lean().exec();
    }
    async updateContact(organizationId, userId, id, data) {
        const updated = await this.contactModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId), deletedAt: null }, { $set: data }, { new: true }).lean().exec();
        if (updated)
            this.trackAnalyticsAsync(organizationId, 'CONTACT_UPDATED', userId, { contactId: id });
        return updated;
    }
    async softDeleteContact(organizationId, userId, contactId) {
        await this.contactModel.updateOne({ _id: new mongoose_2.Types.ObjectId(contactId), organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { $set: { deletedAt: new Date() } });
        this.trackAnalyticsAsync(organizationId, 'CONTACT_DELETED', userId, { contactId });
    }
    async createPipeline(organizationId, userId, data) {
        const pipeline = await this.pipelineModel.create({
            ...data,
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            createdBy: new mongoose_2.Types.ObjectId(userId)
        });
        await this.redisService.del(this.getCacheKey(organizationId, 'pipelines'));
        this.trackAnalyticsAsync(organizationId, 'PIPELINE_CREATED', userId, { pipelineId: pipeline._id });
        return pipeline.toObject();
    }
    async getPipelines(organizationId) {
        const cacheKey = this.getCacheKey(organizationId, 'pipelines');
        const cached = await this.redisService.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.pipelineModel.find({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            deletedAt: null
        }).select('-__v').lean().exec();
        await this.redisService.setex(cacheKey, 3600, JSON.stringify(data));
        return data;
    }
    async updatePipeline(organizationId, userId, id, data) {
        const updated = await this.pipelineModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId), deletedAt: null }, { $set: data }, { new: true }).lean().exec();
        if (updated) {
            await this.redisService.del(this.getCacheKey(organizationId, 'pipelines'));
            this.trackAnalyticsAsync(organizationId, 'PIPELINE_UPDATED', userId, { pipelineId: id });
        }
        return updated;
    }
    async deletePipeline(organizationId, userId, id) {
        await this.pipelineModel.updateOne({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { $set: { deletedAt: new Date() } });
        await this.redisService.del(this.getCacheKey(organizationId, 'pipelines'));
        this.trackAnalyticsAsync(organizationId, 'PIPELINE_DELETED', userId, { pipelineId: id });
    }
    async createStage(organizationId, userId, data) {
        const stage = await this.stageModel.create({
            ...data,
            organizationId: new mongoose_2.Types.ObjectId(organizationId)
        });
        await this.redisService.del(this.getCacheKey(organizationId, `stages:${data.pipelineId}`));
        this.trackAnalyticsAsync(organizationId, 'STAGE_CREATED', userId, { stageId: stage._id, pipelineId: data.pipelineId });
        return stage.toObject();
    }
    async getStages(pipelineId) {
        const cacheKey = `crm:v1:stages:${pipelineId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const data = await this.stageModel.find({
            pipelineId: new mongoose_2.Types.ObjectId(pipelineId),
            deletedAt: null
        }).sort({ order: 1 }).select('-__v').lean().exec();
        await this.redisService.setex(cacheKey, 3600, JSON.stringify(data));
        return data;
    }
    async updateStage(organizationId, userId, id, data) {
        const updated = await this.stageModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId), deletedAt: null }, { $set: data }, { new: true }).lean().exec();
        if (updated) {
            await this.redisService.del(this.getCacheKey(organizationId, `stages:${updated.pipelineId}`));
            this.trackAnalyticsAsync(organizationId, 'STAGE_UPDATED', userId, { stageId: id });
        }
        return updated;
    }
    async deleteStage(organizationId, userId, id) {
        const stage = await this.stageModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId) });
        if (stage) {
            await this.stageModel.updateOne({ _id: new mongoose_2.Types.ObjectId(id) }, { $set: { deletedAt: new Date() } });
            await this.redisService.del(this.getCacheKey(organizationId, `stages:${stage.pipelineId}`));
            this.trackAnalyticsAsync(organizationId, 'STAGE_DELETED', userId, { stageId: id });
        }
    }
    async createDeal(organizationId, userId, data) {
        const deal = await this.dealModel.create({
            ...data,
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            ownerId: data.ownerId || new mongoose_2.Types.ObjectId(userId)
        });
        this.trackAnalyticsAsync(organizationId, 'DEAL_CREATED', userId, { dealId: deal._id });
        return deal.toObject();
    }
    async getDeals(user, query) {
        const limit = Number(query.limit) || 20;
        const page = Number(query.page) || 1;
        const filter = this.getVisibilityFilter(user);
        if (query.pipelineId)
            filter.pipelineId = new mongoose_2.Types.ObjectId(query.pipelineId);
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
        return { data, meta: { total, page, limit } };
    }
    async getDealById(organizationId, id) {
        return this.dealModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            deletedAt: null
        }).populate('contactId').populate('stageId').select('-__v').lean().exec();
    }
    async updateDeal(organizationId, userId, id, data) {
        const updated = await this.dealModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId), deletedAt: null }, { $set: data }, { new: true }).lean().exec();
        if (updated)
            this.trackAnalyticsAsync(organizationId, 'DEAL_UPDATED', userId, { dealId: id });
        return updated;
    }
    async deleteDeal(organizationId, userId, id) {
        await this.dealModel.updateOne({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { $set: { deletedAt: new Date() } });
        this.trackAnalyticsAsync(organizationId, 'DEAL_DELETED', userId, { dealId: id });
    }
    async moveDealStage(organizationId, userId, dealId, stageId) {
        const targetStage = await this.stageModel.findById(stageId);
        if (!targetStage || targetStage.deletedAt)
            throw new common_1.NotFoundException('Target stage not found');
        const deal = await this.dealModel.findOne({
            _id: new mongoose_2.Types.ObjectId(dealId),
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            deletedAt: null
        });
        if (!deal)
            throw new common_1.NotFoundException('Deal not found');
        if (targetStage.pipelineId.toString() !== deal.pipelineId.toString()) {
            throw new common_1.ForbiddenException('Target stage does not belong to the current pipeline');
        }
        const updated = await this.dealModel.findByIdAndUpdate(dealId, { $set: { stageId: targetStage._id } }, { new: true }).lean().exec();
        this.trackAnalyticsAsync(organizationId, 'DEAL_MOVED_STAGE', userId, {
            dealId: deal._id,
            stageId,
            pipelineId: deal.pipelineId
        });
        return updated;
    }
    async reorderStages(organizationId, userId, pipelineId, stageOrders) {
        const orgId = new mongoose_2.Types.ObjectId(organizationId);
        const pipeId = new mongoose_2.Types.ObjectId(pipelineId);
        const bulkOps = stageOrders.map(so => ({
            updateOne: {
                filter: { _id: new mongoose_2.Types.ObjectId(so.id), organizationId: orgId, pipelineId: pipeId },
                update: { $set: { order: so.order } }
            }
        }));
        await this.stageModel.bulkWrite(bulkOps);
        await this.redisService.del(this.getCacheKey(organizationId, `stages:${pipelineId}`));
        this.trackAnalyticsAsync(organizationId, 'STAGES_REORDERED', userId, { pipelineId });
    }
    async bulkMoveDealsStage(organizationId, userId, dealIds, targetStageId) {
        const orgId = new mongoose_2.Types.ObjectId(organizationId);
        const stageId = new mongoose_2.Types.ObjectId(targetStageId);
        const result = await this.dealModel.updateMany({ _id: { $in: dealIds.map(id => new mongoose_2.Types.ObjectId(id)) }, organizationId: orgId }, { $set: { stageId } });
        this.trackAnalyticsAsync(organizationId, 'BULK_ACTION_PERFORMED', userId, {
            action: 'move_deals',
            count: dealIds.length,
            targetStageId
        });
        return result;
    }
    async logActivity(organizationId, userId, data) {
        const activity = await this.activityModel.create({
            ...data,
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            ownerId: new mongoose_2.Types.ObjectId(userId)
        });
        this.trackAnalyticsAsync(organizationId, 'ACTIVITY_CREATED', userId, { activityId: activity._id });
        return activity.toObject();
    }
    async getActivities(organizationId, query) {
        const limit = Number(query.limit) || 20;
        const page = Number(query.page) || 1;
        const filter = { organizationId: new mongoose_2.Types.ObjectId(organizationId), deletedAt: null };
        if (query.contactId)
            filter.contactId = new mongoose_2.Types.ObjectId(query.contactId);
        if (query.dealId)
            filter.dealId = new mongoose_2.Types.ObjectId(query.dealId);
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
    async updateActivity(organizationId, userId, id, data) {
        const updated = await this.activityModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId), deletedAt: null }, { $set: data }, { new: true }).lean().exec();
        if (updated)
            this.trackAnalyticsAsync(organizationId, 'ACTIVITY_UPDATED', userId, { activityId: id });
        return updated;
    }
    async deleteActivity(organizationId, userId, id) {
        await this.activityModel.updateOne({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { $set: { deletedAt: new Date() } });
        this.trackAnalyticsAsync(organizationId, 'ACTIVITY_DELETED', userId, { activityId: id });
    }
    async addNote(organizationId, userId, data) {
        const note = await this.noteModel.create({
            ...data,
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            ownerId: new mongoose_2.Types.ObjectId(userId)
        });
        this.trackAnalyticsAsync(organizationId, 'NOTE_CREATED', userId, { noteId: note._id });
        return note.toObject();
    }
    async getNotes(organizationId, query) {
        const limit = Number(query.limit) || 20;
        const page = Number(query.page) || 1;
        const filter = {
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            linkedEntityId: new mongoose_2.Types.ObjectId(query.linkedEntityId),
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
    async updateNote(organizationId, userId, id, data) {
        const updated = await this.noteModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId), deletedAt: null }, { $set: data }, { new: true }).lean().exec();
        if (updated)
            this.trackAnalyticsAsync(organizationId, 'NOTE_UPDATED', userId, { noteId: id });
        return updated;
    }
    async deleteNote(organizationId, userId, id) {
        await this.noteModel.updateOne({ _id: new mongoose_2.Types.ObjectId(id), organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { $set: { deletedAt: new Date() } });
        this.trackAnalyticsAsync(organizationId, 'NOTE_DELETED', userId, { noteId: id });
    }
    async getTimeline(organizationId, contactId, dealId) {
        const orgId = new mongoose_2.Types.ObjectId(organizationId);
        const filter = { organizationId: orgId, deletedAt: null };
        if (contactId)
            filter.contactId = new mongoose_2.Types.ObjectId(contactId);
        if (dealId)
            filter.dealId = new mongoose_2.Types.ObjectId(dealId);
        const [activities, notes] = await Promise.all([
            this.activityModel.find(filter).sort({ createdAt: -1 }).limit(50).lean().exec(),
            this.noteModel.find({
                organizationId: orgId,
                linkedEntityId: contactId ? new mongoose_2.Types.ObjectId(contactId) : (dealId ? new mongoose_2.Types.ObjectId(dealId) : null),
                deletedAt: null
            }).sort({ createdAt: -1 }).limit(50).lean().exec(),
        ]);
        const timeline = [
            ...activities.map(a => ({ ...a, timelineType: 'activity' })),
            ...notes.map(n => ({ ...n, timelineType: 'note' }))
        ];
        return timeline.sort((a, b) => b.createdAt - a.createdAt);
    }
    async bulkDeleteContacts(organizationId, userId, contactIds) {
        const result = await this.contactModel.updateMany({ _id: { $in: contactIds.map(id => new mongoose_2.Types.ObjectId(id)) }, organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { $set: { deletedAt: new Date() } });
        this.trackAnalyticsAsync(organizationId, 'BULK_ACTION_PERFORMED', userId, { action: 'delete_contacts', count: contactIds.length });
        return result;
    }
    async sendWhatsAppAsync(contactId, message) {
        const contact = await this.contactModel.findById(contactId);
        if (!contact || contact.deletedAt)
            throw new common_1.NotFoundException('Contact not found');
        await this.notificationsQueue.add('send-whatsapp', {
            phone: contact.phone,
            message,
        });
        return { success: true, status: 'queued' };
    }
    async getTeamMembers(organizationId) {
        return this.organizationsService.getMembers(organizationId);
    }
    async addTeamMember(organizationId, userId, role) {
        const existing = await this.organizationsService.getMembership(userId, organizationId);
        if (existing)
            throw new common_1.ConflictException('User is already a member of this organization');
        return this.organizationsService.addMember(organizationId, userId, role);
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contact_schema_js_1.Contact.name)),
    __param(1, (0, mongoose_1.InjectModel)(deal_schema_js_1.Deal.name)),
    __param(2, (0, mongoose_1.InjectModel)(activity_schema_js_1.Activity.name)),
    __param(3, (0, mongoose_1.InjectModel)(pipeline_schema_js_1.Pipeline.name)),
    __param(4, (0, mongoose_1.InjectModel)(stage_schema_js_1.Stage.name)),
    __param(5, (0, mongoose_1.InjectModel)(note_schema_js_1.Note.name)),
    __param(6, (0, bullmq_1.InjectQueue)('notifications')),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => organizations_service_js_1.OrganizationsService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        bullmq_2.Queue,
        organizations_service_js_1.OrganizationsService,
        analytics_service_js_1.AnalyticsService,
        redis_service_js_1.RedisService])
], CrmService);
//# sourceMappingURL=crm.service.js.map