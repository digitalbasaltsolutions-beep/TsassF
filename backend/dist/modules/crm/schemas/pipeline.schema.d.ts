import { BaseDocument } from '../../../shared/database/base.schema.js';
export declare class Pipeline extends BaseDocument {
    name: string;
    isActive: boolean;
}
export declare const PipelineSchema: import("mongoose").Schema<Pipeline, import("mongoose").Model<Pipeline, any, any, any, (import("mongoose").Document<unknown, any, Pipeline, any, import("mongoose").DefaultSchemaOptions> & Pipeline & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Pipeline, any, import("mongoose").DefaultSchemaOptions> & Pipeline & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, Pipeline>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Pipeline, import("mongoose").Document<unknown, {}, Pipeline, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Pipeline, import("mongoose").Document<unknown, {}, Pipeline, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId | undefined, Pipeline, import("mongoose").Document<unknown, {}, Pipeline, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId | undefined, Pipeline, import("mongoose").Document<unknown, {}, Pipeline, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Pipeline, import("mongoose").Document<unknown, {}, Pipeline, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Pipeline, import("mongoose").Document<unknown, {}, Pipeline, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Pipeline, import("mongoose").Document<unknown, {}, Pipeline, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Pipeline>;
