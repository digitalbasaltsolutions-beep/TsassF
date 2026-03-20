import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema.js';
export declare enum DealStatus {
    Open = "Open",
    Won = "Won",
    Lost = "Lost"
}
export declare class Deal extends BaseDocument {
    title: string;
    value: number;
    status: DealStatus;
    pipelineId: Types.ObjectId;
    stageId: Types.ObjectId;
    contactId: Types.ObjectId;
    ownerId: Types.ObjectId;
    expectedCloseDate: Date;
}
export declare const DealSchema: import("mongoose").Schema<Deal, import("mongoose").Model<Deal, any, any, any, (import("mongoose").Document<unknown, any, Deal, any, import("mongoose").DefaultSchemaOptions> & Deal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Deal, any, import("mongoose").DefaultSchemaOptions> & Deal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Deal>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Deal, import("mongoose").Document<unknown, {}, Deal, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    value?: import("mongoose").SchemaDefinitionProperty<number, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ownerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<DealStatus, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pipelineId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stageId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contactId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedCloseDate?: import("mongoose").SchemaDefinitionProperty<Date, Deal, import("mongoose").Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Deal>;
