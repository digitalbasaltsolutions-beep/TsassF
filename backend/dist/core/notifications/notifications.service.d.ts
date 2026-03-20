import { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';
export declare class NotificationsService {
    private notificationModel;
    private readonly logger;
    constructor(notificationModel: Model<Notification>);
    createNotification(organizationId: string, title: string, message: string, type?: string): Promise<import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyNotifications(organizationId: string): Promise<(import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markAsRead(id: string): Promise<(import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    clearAll(organizationId: string): Promise<import("mongoose").UpdateWriteOpResult>;
}
