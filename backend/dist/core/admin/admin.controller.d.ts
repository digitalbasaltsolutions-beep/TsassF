import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getOrganizations(): Promise<(import("mongoose").Document<unknown, {}, import("../organizations/schemas/organization.schema").Organization, {}, import("mongoose").DefaultSchemaOptions> & import("../organizations/schemas/organization.schema").Organization & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getUsers(): Promise<(import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    deleteOrganization(id: string): Promise<{
        success: boolean;
    }>;
    updateOrganization(id: string, data: {
        subscriptions?: string[];
        subscriptionPlan?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../organizations/schemas/organization.schema").Organization, {}, import("mongoose").DefaultSchemaOptions> & import("../organizations/schemas/organization.schema").Organization & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getStats(): Promise<{
        totalOrganizations: number;
        totalUsers: number;
        activeSubscriptions: number;
        mrr: number;
        status: string;
    }>;
}
