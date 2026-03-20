import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';
export declare enum PlanType {
    Free = "Free",
    Pro = "Pro",
    Enterprise = "Enterprise"
}
export declare class Subscription extends BaseDocument {
    organizationId: Types.ObjectId;
    plan: PlanType;
    status: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    apiCallsUsage: number;
}
export declare const SubscriptionSchema: import("mongoose").Schema<Subscription, import("mongoose").Model<Subscription, any, any, any, (import("mongoose").Document<unknown, any, Subscription, any, import("mongoose").DefaultSchemaOptions> & Subscription & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Subscription, any, import("mongoose").DefaultSchemaOptions> & Subscription & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Subscription>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subscription, import("mongoose").Document<unknown, {}, Subscription, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Subscription & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Subscription, import("mongoose").Document<unknown, {}, Subscription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscription & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Subscription, import("mongoose").Document<unknown, {}, Subscription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscription & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Subscription, import("mongoose").Document<unknown, {}, Subscription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscription & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Subscription, import("mongoose").Document<unknown, {}, Subscription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscription & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Subscription, import("mongoose").Document<unknown, {}, Subscription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscription & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    plan?: import("mongoose").SchemaDefinitionProperty<PlanType, Subscription, import("mongoose").Document<unknown, {}, Subscription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscription & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stripeCustomerId?: import("mongoose").SchemaDefinitionProperty<string | undefined, Subscription, import("mongoose").Document<unknown, {}, Subscription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscription & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stripeSubscriptionId?: import("mongoose").SchemaDefinitionProperty<string | undefined, Subscription, import("mongoose").Document<unknown, {}, Subscription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscription & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    apiCallsUsage?: import("mongoose").SchemaDefinitionProperty<number, Subscription, import("mongoose").Document<unknown, {}, Subscription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscription & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Subscription>;
