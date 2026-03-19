import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';
export declare class Organization extends BaseDocument {
    name: string;
    ownerId: Types.ObjectId;
    subscriptionPlan: string;
}
export declare const OrganizationSchema: import("mongoose").Schema<Organization, import("mongoose").Model<Organization, any, any, any, (import("mongoose").Document<unknown, any, Organization, any, import("mongoose").DefaultSchemaOptions> & Organization & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Organization, any, import("mongoose").DefaultSchemaOptions> & Organization & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Organization>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Organization, import("mongoose").Document<unknown, {}, Organization, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Organization & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Organization, import("mongoose").Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Organization, import("mongoose").Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Organization, import("mongoose").Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Organization, import("mongoose").Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ownerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Organization, import("mongoose").Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subscriptionPlan?: import("mongoose").SchemaDefinitionProperty<string, Organization, import("mongoose").Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Organization>;
