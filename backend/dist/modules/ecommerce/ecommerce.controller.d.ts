import { EcommerceService } from './ecommerce.service';
export declare class EcommerceController {
    private readonly ecommerceService;
    constructor(ecommerceService: EcommerceService);
    getProducts(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/product.schema").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    createProduct(data: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/product.schema").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getOrders(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/order.schema").Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    createOrder(data: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/order.schema").Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateOrderStatus(id: string, status: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/order.schema").Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
