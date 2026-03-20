import { CrmService } from './crm.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { CreateDealDto } from './dto/create-deal.dto.js';
import { CreatePipelineDto, CreateStageDto } from './dto/pipeline-stage.dto.js';
import { CreateActivityDto } from './dto/create-activity.dto.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
export declare class CrmController {
    private readonly crmService;
    constructor(crmService: CrmService);
    createContact(req: any, data: CreateContactDto): Promise<import("./schemas/contact.schema.js").Contact>;
    getContacts(req: any, search?: string, page?: number, limit?: number): Promise<{
        data: (import("./schemas/contact.schema.js").Contact & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getContactById(req: any, id: string): Promise<import("./schemas/contact.schema.js").Contact | null>;
    updateContact(req: any, id: string, data: Partial<CreateContactDto>): Promise<import("./schemas/contact.schema.js").Contact | null>;
    deleteContact(req: any, id: string): Promise<void>;
    bulkDeleteContacts(req: any, ids: string[]): Promise<any>;
    createPipeline(req: any, data: CreatePipelineDto): Promise<import("./schemas/pipeline.schema.js").Pipeline>;
    getPipelines(req: any): Promise<import("./schemas/pipeline.schema.js").Pipeline[]>;
    updatePipeline(req: any, id: string, data: Partial<CreatePipelineDto>): Promise<import("./schemas/pipeline.schema.js").Pipeline | null>;
    deletePipeline(req: any, id: string): Promise<void>;
    createStage(req: any, data: CreateStageDto): Promise<import("./schemas/stage.schema.js").Stage>;
    getStages(id: string): Promise<import("./schemas/stage.schema.js").Stage[]>;
    updateStage(req: any, id: string, data: Partial<CreateStageDto>): Promise<import("./schemas/stage.schema.js").Stage | null>;
    deleteStage(req: any, id: string): Promise<void>;
    reorderStages(req: any, id: string, stages: {
        id: string;
        order: number;
    }[]): Promise<void>;
    createDeal(req: any, data: CreateDealDto): Promise<import("./schemas/deal.schema.js").Deal>;
    getDeals(req: any, pipelineId?: string, search?: string, page?: number, limit?: number): Promise<{
        data: (import("./schemas/deal.schema.js").Deal & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getDealById(req: any, id: string): Promise<import("./schemas/deal.schema.js").Deal | null>;
    updateDeal(req: any, id: string, data: Partial<CreateDealDto>): Promise<import("./schemas/deal.schema.js").Deal | null>;
    deleteDeal(req: any, id: string): Promise<void>;
    moveDealStage(req: any, id: string, stageId: string): Promise<import("./schemas/deal.schema.js").Deal>;
    bulkMoveDealsStage(req: any, ids: string[], targetStageId: string): Promise<any>;
    logActivity(req: any, data: CreateActivityDto): Promise<import("./schemas/activity.schema.js").Activity>;
    getActivities(req: any, contactId?: string, dealId?: string, page?: number, limit?: number): Promise<{
        data: (import("./schemas/activity.schema.js").Activity & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    updateActivity(req: any, id: string, data: Partial<CreateActivityDto>): Promise<import("./schemas/activity.schema.js").Activity | null>;
    deleteActivity(req: any, id: string): Promise<void>;
    getTimeline(req: any, contactId?: string, dealId?: string): Promise<any[]>;
    addNote(req: any, data: CreateNoteDto): Promise<import("./schemas/note.schema.js").Note>;
    getNotes(req: any, linkedEntityId: string, page?: number, limit?: number): Promise<{
        data: (import("./schemas/note.schema.js").Note & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    updateNote(req: any, id: string, data: Partial<CreateNoteDto>): Promise<import("./schemas/note.schema.js").Note | null>;
    deleteNote(req: any, id: string): Promise<void>;
    sendWhatsAppMessage(id: string, message: string): Promise<{
        success: boolean;
        status: string;
    }>;
    getTeamMembers(req: any): Promise<import("../../core/organizations/schemas/membership.schema.js").Membership[]>;
    addTeamMember(req: any, body: {
        userId: string;
        role: string;
    }): Promise<import("../../core/organizations/schemas/membership.schema.js").Membership>;
}
