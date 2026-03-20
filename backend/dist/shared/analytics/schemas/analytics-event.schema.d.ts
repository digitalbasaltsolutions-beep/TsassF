import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';
export declare class AnalyticsEvent extends BaseDocument {
    organizationId: Types.ObjectId;
    type: string;
    metadata: any;
    userId: Types.ObjectId;
}
export declare const AnalyticsEventSchema: import("mongoose").Schema<AnalyticsEvent, import("mongoose").Model<AnalyticsEvent, any, any, any, (import("mongoose").Document<unknown, any, AnalyticsEvent, any, import("mongoose").DefaultSchemaOptions> & AnalyticsEvent & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, AnalyticsEvent, any, import("mongoose").DefaultSchemaOptions> & AnalyticsEvent & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, AnalyticsEvent>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AnalyticsEvent, import("mongoose").Document<unknown, {}, AnalyticsEvent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AnalyticsEvent & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AnalyticsEvent, import("mongoose").Document<unknown, {}, AnalyticsEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnalyticsEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, AnalyticsEvent, import("mongoose").Document<unknown, {}, AnalyticsEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnalyticsEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AnalyticsEvent, import("mongoose").Document<unknown, {}, AnalyticsEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnalyticsEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AnalyticsEvent, import("mongoose").Document<unknown, {}, AnalyticsEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnalyticsEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, AnalyticsEvent, import("mongoose").Document<unknown, {}, AnalyticsEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnalyticsEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, AnalyticsEvent, import("mongoose").Document<unknown, {}, AnalyticsEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnalyticsEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<any, AnalyticsEvent, import("mongoose").Document<unknown, {}, AnalyticsEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnalyticsEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AnalyticsEvent>;
