import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard.js';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('recent')
  async getRecentActivity(@Request() req: any, @Query('limit') limit = 10) {
    return this.analyticsService.getRecentEvents(req.user.organizationId, limit);
  }

  @Get('usage')
  async getUsageStats(@Request() req: any) {
    return this.analyticsService.getUsageOverview(req.user.organizationId);
  }
}
