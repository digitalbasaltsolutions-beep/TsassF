import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { CrmService } from './crm.service';
import { WhatsAppService } from './whatsapp.service';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { Roles } from '../../core/auth/decorators/roles.decorator';
import { Role } from '../../shared/constants/roles.enum';

@Controller('crm')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CrmController {
  constructor(
    private readonly crmService: CrmService,
    private readonly whatsappService: WhatsAppService
  ) {}

  // --- Contacts ---
  @Post('contacts')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async createContact(@Body() data: any) {
    return this.crmService.createContact(data);
  }

  @Get('contacts')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getContacts() {
    return this.crmService.getContacts();
  }

  // --- Deals ---
  @Post('deals')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async createDeal(@Body() data: any) {
    return this.crmService.createDeal(data);
  }

  @Get('deals')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getDeals() {
    return this.crmService.getDeals();
  }

  @Put('deals/:id/stage')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async updateDealStage(@Param('id') id: string, @Body('pipelineStage') pipelineStage: string) {
    return this.crmService.updateDealStage(id, pipelineStage);
  }

  // --- Activities ---
  @Post('activities')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async logActivity(@Body() data: any) {
    return this.crmService.logActivity(data);
  }

  @Get('deals/:id/activities')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getDealActivities(@Param('id') id: string) {
    return this.crmService.getActivitiesForDeal(id);
  }

  // --- WhatsApp Integration ---
  @Post('contacts/:id/whatsapp')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async sendWhatsAppMessage(@Param('id') id: string, @Body('message') message: string) {
    return this.whatsappService.sendMessage(id, message);
  }
}
