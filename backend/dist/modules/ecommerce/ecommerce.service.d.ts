import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { Order } from './schemas/order.schema';
export declare class EcommerceService {
    private productModel;
    private orderModel;
    constructor(productModel: Model<Product>, orderModel: Model<Order>);
    getProducts(): Promise<(import("mongoose").Document<unknown, {}, Product, {}, import("mongoose").DefaultSchemaOptions> & Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    createProduct(data: any): Promise<import("mongoose").Document<unknown, {}, Product, {}, import("mongoose").DefaultSchemaOptions> & Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getOrders(): Promise<(import("mongoose").Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    createOrder(data: any): Promise<import("mongoose").Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateOrderStatus(id: string, status: string): Promise<import("mongoose").Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
