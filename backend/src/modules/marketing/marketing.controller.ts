import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard.js';

@Controller('marketing')
@UseGuards(JwtAuthGuard)
export class MarketingController {
  @Get()
  getMarketingInfo() {
    return { data: [], meta: { total: 0, page: 1, limit: 10 } };
  }
}
