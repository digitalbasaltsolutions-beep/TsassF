import { Model, Types } from 'mongoose';
import { Contact } from './schemas/contact.schema.js';
import { Deal } from './schemas/deal.schema.js';
import { Activity } from './schemas/activity.schema.js';
import { Pipeline } from './schemas/pipeline.schema.js';
import { Stage } from './schemas/stage.schema.js';
import { Note } from './schemas/note.schema.js';
import { Queue } from 'bullmq';
import { OrganizationsService } from '../../core/organizations/organizations.service.js';
import { AnalyticsService } from '../../shared/analytics/analytics.service.js';
import { RedisService } from '../../shared/redis/redis.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { CreateDealDto } from './dto/create-deal.dto.js';
import { CreatePipelineDto, CreateStageDto } from './dto/pipeline-stage.dto.js';
import { CreateActivityDto } from './dto/create-activity.dto.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
export declare class CrmService {
    private contactModel;
    private dealModel;
    private activityModel;
    private pipelineModel;
    private stageModel;
    private noteModel;
    private readonly notificationsQueue;
    private organizationsService;
    private analyticsService;
    private redisService;
    constructor(contactModel: Model<Contact>, dealModel: Model<Deal>, activityModel: Model<Activity>, pipelineModel: Model<Pipeline>, stageModel: Model<Stage>, noteModel: Model<Note>, notificationsQueue: Queue, organizationsService: OrganizationsService, analyticsService: AnalyticsService, redisService: RedisService);
    private getCacheKey;
    private trackAnalyticsAsync;
    private getVisibilityFilter;
    createContact(organizationId: string, userId: string, data: CreateContactDto): Promise<Contact>;
    getContacts(user: any, query: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (Contact & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getContactById(organizationId: string, id: string): Promise<Contact | null>;
    updateContact(organizationId: string, userId: string, id: string, data: Partial<CreateContactDto>): Promise<Contact | null>;
    softDeleteContact(organizationId: string, userId: string, contactId: string): Promise<void>;
    createPipeline(organizationId: string, userId: string, data: CreatePipelineDto): Promise<Pipeline>;
    getPipelines(organizationId: string): Promise<Pipeline[]>;
    updatePipeline(organizationId: string, userId: string, id: string, data: Partial<CreatePipelineDto>): Promise<Pipeline | null>;
    deletePipeline(organizationId: string, userId: string, id: string): Promise<void>;
    createStage(organizationId: string, userId: string, data: CreateStageDto): Promise<Stage>;
    getStages(pipelineId: string): Promise<Stage[]>;
    updateStage(organizationId: string, userId: string, id: string, data: Partial<CreateStageDto>): Promise<Stage | null>;
    deleteStage(organizationId: string, userId: string, id: string): Promise<void>;
    createDeal(organizationId: string, userId: string, data: CreateDealDto): Promise<Deal>;
    getDeals(user: any, query: {
        pipelineId?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (Deal & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getDealById(organizationId: string, id: string): Promise<Deal | null>;
    updateDeal(organizationId: string, userId: string, id: string, data: Partial<CreateDealDto>): Promise<Deal | null>;
    deleteDeal(organizationId: string, userId: string, id: string): Promise<void>;
    moveDealStage(organizationId: string, userId: string, dealId: string, stageId: string): Promise<Deal>;
    reorderStages(organizationId: string, userId: string, pipelineId: string, stageOrders: {
        id: string;
        order: number;
    }[]): Promise<void>;
    bulkMoveDealsStage(organizationId: string, userId: string, dealIds: string[], targetStageId: string): Promise<any>;
    logActivity(organizationId: string, userId: string, data: CreateActivityDto): Promise<Activity>;
    getActivities(organizationId: string, query: {
        contactId?: string;
        dealId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (Activity & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    updateActivity(organizationId: string, userId: string, id: string, data: Partial<CreateActivityDto>): Promise<Activity | null>;
    deleteActivity(organizationId: string, userId: string, id: string): Promise<void>;
    addNote(organizationId: string, userId: string, data: CreateNoteDto): Promise<Note>;
    getNotes(organizationId: string, query: {
        linkedEntityId: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (Note & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    updateNote(organizationId: string, userId: string, id: string, data: Partial<CreateNoteDto>): Promise<Note | null>;
    deleteNote(organizationId: string, userId: string, id: string): Promise<void>;
    getTimeline(organizationId: string, contactId?: string, dealId?: string): Promise<any[]>;
    bulkDeleteContacts(organizationId: string, userId: string, contactIds: string[]): Promise<any>;
    sendWhatsAppAsync(contactId: string, message: string): Promise<{
        success: boolean;
        status: string;
    }>;
    getTeamMembers(organizationId: string): Promise<import("../../core/organizations/schemas/membership.schema.js").Membership[]>;
    addTeamMember(organizationId: string, userId: string, role: any): Promise<import("../../core/organizations/schemas/membership.schema.js").Membership>;
}
