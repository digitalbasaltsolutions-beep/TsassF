import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema.js';
export declare class Stage extends BaseDocument {
    pipelineId: Types.ObjectId;
    name: string;
    order: number;
    color: string;
}
export declare const StageSchema: import("mongoose").Schema<Stage, import("mongoose").Model<Stage, any, any, any, (import("mongoose").Document<unknown, any, Stage, any, import("mongoose").DefaultSchemaOptions> & Stage & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Stage, any, import("mongoose").DefaultSchemaOptions> & Stage & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Stage>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Stage, import("mongoose").Document<unknown, {}, Stage, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Stage & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Stage, import("mongoose").Document<unknown, {}, Stage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Stage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Stage, import("mongoose").Document<unknown, {}, Stage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Stage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Stage, import("mongoose").Document<unknown, {}, Stage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Stage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Stage, import("mongoose").Document<unknown, {}, Stage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Stage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Stage, import("mongoose").Document<unknown, {}, Stage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Stage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pipelineId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Stage, import("mongoose").Document<unknown, {}, Stage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Stage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    order?: import("mongoose").SchemaDefinitionProperty<number, Stage, import("mongoose").Document<unknown, {}, Stage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Stage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    color?: import("mongoose").SchemaDefinitionProperty<string, Stage, import("mongoose").Document<unknown, {}, Stage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Stage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Stage>;
