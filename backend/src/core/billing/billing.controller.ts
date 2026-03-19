import { Controller, Get, Post, Body, UseGuards, Req, Headers } from '@nestjs/common';
import { BillingService } from './billing.service';
import { PlanType } from './schemas/subscription.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../shared/constants/roles.enum';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  getPlans() {
    return this.billingService.getPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-subscription')
  async getMySubscription(@Req() req: any) {
    const orgId = req.user.organizationId;
    return this.billingService.getSubscriptionForOrg(orgId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Owner)
  @Post('create-checkout-session')
  async createCheckoutSession(@Req() req: any, @Body('plan') plan: PlanType) {
    const orgId = req.user.organizationId;
    return this.billingService.createCheckoutSession(orgId, plan);
  }

  // Webhook is completely public and not guarded by JWT
  @Post('webhook')
  async handleWebhook(@Headers('stripe-signature') signature: string, @Body() payload: any) {
    return this.billingService.handleStripeWebhook(signature, payload);
  }
}
