import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';
export declare class Order extends BaseDocument {
    organizationId: Types.ObjectId;
    customer: Types.ObjectId;
    products: Types.ObjectId[];
    totalAmount: number;
    status: string;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, (import("mongoose").Document<unknown, any, Order, any, import("mongoose").DefaultSchemaOptions> & Order & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Order, any, import("mongoose").DefaultSchemaOptions> & Order & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Order>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, import("mongoose").Document<unknown, {}, Order, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Order & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    products?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalAmount?: import("mongoose").SchemaDefinitionProperty<number, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Order>;
