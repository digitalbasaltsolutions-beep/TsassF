"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const analytics_event_schema_js_1 = require("./schemas/analytics-event.schema.js");
let AnalyticsService = class AnalyticsService {
    eventModel;
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async trackEvent(organizationId, type, metadata = {}, userId) {
        try {
            await this.eventModel.create({
                organizationId: new mongoose_2.Types.ObjectId(organizationId),
                type,
                metadata,
                userId: userId ? new mongoose_2.Types.ObjectId(userId) : undefined
            });
        }
        catch (e) {
            console.error('Analytics tracking failed', e);
        }
    }
    async trackLimitHit(organizationId, usageType, userId) {
        return this.trackEvent(organizationId, 'LIMIT_HIT', { usageType }, userId);
    }
    async getRecentEvents(organizationId, limit = 10) {
        return this.eventModel
            .find({ organizationId: new mongoose_2.Types.ObjectId(organizationId) })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .lean()
            .exec();
    }
    async getUsageOverview(organizationId) {
        const stats = await this.eventModel.aggregate([
            { $match: { organizationId: new mongoose_2.Types.ObjectId(organizationId) } },
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);
        return stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(analytics_event_schema_js_1.AnalyticsEvent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map