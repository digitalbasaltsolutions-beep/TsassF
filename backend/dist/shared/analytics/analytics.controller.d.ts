import { AnalyticsService } from './analytics.service.js';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getRecentActivity(req: any, limit?: number): Promise<(import("./schemas/analytics-event.schema.js").AnalyticsEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUsageStats(req: any): Promise<any>;
}
