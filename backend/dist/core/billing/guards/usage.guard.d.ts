import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsageService } from '../usage.service.js';
import { AnalyticsService } from '../../../shared/analytics/analytics.service.js';
export declare class UsageGuard implements CanActivate {
    private reflector;
    private usageService;
    private analyticsService;
    constructor(reflector: Reflector, usageService: UsageService, analyticsService: AnalyticsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
