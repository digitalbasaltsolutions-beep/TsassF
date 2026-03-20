import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AnalyticsEvent } from './schemas/analytics-event.schema.js';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(AnalyticsEvent.name) private eventModel: Model<AnalyticsEvent>
  ) {}

  async trackEvent(organizationId: string, type: string, metadata: any = {}, userId?: string) {
    try {
      await this.eventModel.create({
        organizationId: new Types.ObjectId(organizationId),
        type,
        metadata,
        userId: userId ? new Types.ObjectId(userId) : undefined
      });
    } catch (e) {
      console.error('Analytics tracking failed', e);
    }
  }

  async trackLimitHit(organizationId: string, usageType: string, userId?: string) {
    return this.trackEvent(organizationId, 'LIMIT_HIT', { usageType }, userId);
  }
}
