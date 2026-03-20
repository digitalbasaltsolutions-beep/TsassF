import { Model, Types } from 'mongoose';
import { AnalyticsEvent } from './schemas/analytics-event.schema.js';
export declare class AnalyticsService {
    private eventModel;
    constructor(eventModel: Model<AnalyticsEvent>);
    trackEvent(organizationId: string, type: string, metadata?: any, userId?: string): Promise<void>;
    trackLimitHit(organizationId: string, usageType: string, userId?: string): Promise<void>;
    getRecentEvents(organizationId: string, limit?: number): Promise<(AnalyticsEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUsageOverview(organizationId: string): Promise<any>;
}
