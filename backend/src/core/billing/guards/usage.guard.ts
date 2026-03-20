import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsageService } from '../usage.service.js';
import { AnalyticsService } from '../../../shared/analytics/analytics.service.js';

@Injectable()
export class UsageGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usageService: UsageService,
    private analyticsService: AnalyticsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const usageType = this.reflector.get<'contacts' | 'deals' | 'members' | 'pipelines'>('usageType', context.getHandler());
    
    if (!usageType) {
      return true; // No limit check required for this route
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.organizationId) {
      throw new ForbiddenException('No active organization context');
    }

    // Only block if we are trying to create something (POST)
    const request = context.switchToHttp().getRequest();
    if (request.method !== 'POST') return true;

    try {
      await this.usageService.checkLimit(user.organizationId, usageType);
    } catch (e) {
      await this.analyticsService.trackLimitHit(user.organizationId, usageType, user.userId);
      throw e;
    }
    
    return true;
  }
}
