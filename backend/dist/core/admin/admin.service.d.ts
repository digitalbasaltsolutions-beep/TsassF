import { Model } from 'mongoose';
import { Organization } from '../organizations/schemas/organization.schema';
import { User } from '../users/schemas/user.schema';
import { Membership } from '../organizations/schemas/membership.schema';
export declare class AdminService {
    private orgModel;
    private userModel;
    private membershipModel;
    constructor(orgModel: Model<Organization>, userModel: Model<User>, membershipModel: Model<Membership>);
    getAllOrganizations(): Promise<(import("mongoose").Document<unknown, {}, Organization, {}, import("mongoose").DefaultSchemaOptions> & Organization & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAllUsers(): Promise<(import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
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
    }): Promise<import("mongoose").Document<unknown, {}, Organization, {}, import("mongoose").DefaultSchemaOptions> & Organization & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getGlobalStats(): Promise<{
        totalOrganizations: number;
        totalUsers: number;
        activeSubscriptions: number;
        mrr: number;
        status: string;
    }>;
}
