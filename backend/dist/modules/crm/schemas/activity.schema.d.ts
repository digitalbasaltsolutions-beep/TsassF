import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';
export declare enum ActivityType {
    Call = "Call",
    Meeting = "Meeting",
    Note = "Note",
    Email = "Email"
}
export declare class Activity extends BaseDocument {
    type: ActivityType;
    description: string;
    contactId?: Types.ObjectId;
    dealId?: Types.ObjectId;
}
export declare const ActivitySchema: import("mongoose").Schema<Activity, import("mongoose").Model<Activity, any, any, any, (import("mongoose").Document<unknown, any, Activity, any, import("mongoose").DefaultSchemaOptions> & Activity & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Activity, any, import("mongoose").DefaultSchemaOptions> & Activity & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Activity>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Activity, import("mongoose").Document<unknown, {}, Activity, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Activity & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Activity, import("mongoose").Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<ActivityType, Activity, import("mongoose").Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Activity, import("mongoose").Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Activity, import("mongoose").Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Activity, import("mongoose").Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contactId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Activity, import("mongoose").Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dealId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Activity, import("mongoose").Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Activity>;
