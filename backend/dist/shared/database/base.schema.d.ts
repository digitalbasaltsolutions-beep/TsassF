import { Document, Types } from 'mongoose';
export declare class BaseDocument extends Document {
    organizationId?: Types.ObjectId;
    createdBy?: Types.ObjectId;
    deletedAt?: Date;
}
