import { Controller, Get, Post, Body, Param, Put, UseGuards, Req, Query, Delete, Patch } from '@nestjs/common';
import { CrmService } from './crm.service.js';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../core/auth/guards/roles.guard.js';
import { Roles } from '../../core/auth/decorators/roles.decorator.js';
import { Role } from '../../shared/constants/roles.enum.js';
import { UsageGuard } from '../../core/billing/guards/usage.guard.js';
import { SetUsageType } from '../../core/billing/decorators/usage.decorator.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { CreateDealDto } from './dto/create-deal.dto.js';
import { CreatePipelineDto, CreateStageDto } from './dto/pipeline-stage.dto.js';
import { CreateActivityDto } from './dto/create-activity.dto.js';
import { CreateNoteDto } from './dto/create-note.dto.js';

@Controller('crm')
@UseGuards(JwtAuthGuard, RolesGuard, UsageGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  // --- Contacts ---
  @Post('contacts')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  @SetUsageType('contacts')
  async createContact(@Req() req: any, @Body() data: CreateContactDto) {
    return this.crmService.createContact(req.user.organizationId, { ...data, ownerId: data.ownerId || req.user.userId });
  }

  @Get('contacts')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getContacts(
    @Req() req: any, 
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.crmService.getContacts(req.user, { search, page, limit });
  }

  @Get('contacts/:id')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getContactById(@Req() req: any, @Param('id') id: string) {
    return this.crmService.getContactById(req.user.organizationId, id);
  }

  @Put('contacts/:id')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async updateContact(@Req() req: any, @Param('id') id: string, @Body() data: Partial<CreateContactDto>) {
    return this.crmService.updateContact(req.user.organizationId, id, data);
  }

  @Delete('contacts/:id')
  @Roles(Role.Admin, Role.Owner)
  async deleteContact(@Req() req: any, @Param('id') id: string) {
    return this.crmService.softDeleteContact(req.user.organizationId, id);
  }

  @Post('contacts/bulk-delete')
  @Roles(Role.Admin, Role.Owner)
  async bulkDeleteContacts(@Req() req: any, @Body('ids') ids: string[]) {
    return this.crmService.bulkDeleteContacts(req.user.organizationId, ids);
  }

  // --- Pipelines & Stages ---
  @Post('pipelines')
  @Roles(Role.Admin, Role.Owner)
  @SetUsageType('pipelines')
  async createPipeline(@Req() req: any, @Body() data: CreatePipelineDto) {
    return this.crmService.createPipeline(req.user.organizationId, data);
  }

  @Get('pipelines')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getPipelines(@Req() req: any) {
    return this.crmService.getPipelines(req.user.organizationId);
  }

  @Put('pipelines/:id')
  @Roles(Role.Admin, Role.Owner)
  async updatePipeline(@Req() req: any, @Param('id') id: string, @Body() data: Partial<CreatePipelineDto>) {
    return this.crmService.updatePipeline(req.user.organizationId, id, data);
  }

  @Delete('pipelines/:id')
  @Roles(Role.Admin, Role.Owner)
  async deletePipeline(@Req() req: any, @Param('id') id: string) {
    return this.crmService.deletePipeline(req.user.organizationId, id);
  }

  @Post('stages')
  @Roles(Role.Admin, Role.Owner)
  async createStage(@Req() req: any, @Body() data: CreateStageDto) {
    return this.crmService.createStage(req.user.organizationId, data);
  }

  @Get('pipelines/:id/stages')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getStages(@Param('id') id: string) {
    return this.crmService.getStages(id);
  }

  @Put('stages/:id')
  @Roles(Role.Admin, Role.Owner)
  async updateStage(@Req() req: any, @Param('id') id: string, @Body() data: Partial<CreateStageDto>) {
    return this.crmService.updateStage(req.user.organizationId, id, data);
  }

  @Delete('stages/:id')
  @Roles(Role.Admin, Role.Owner)
  async deleteStage(@Req() req: any, @Param('id') id: string) {
    return this.crmService.deleteStage(req.user.organizationId, id);
  }

  @Patch('pipelines/:id/reorder-stages')
  @Roles(Role.Admin, Role.Owner)
  async reorderStages(@Req() req: any, @Param('id') id: string, @Body('stages') stages: { id: string, order: number }[]) {
    return this.crmService.reorderStages(req.user.organizationId, id, stages);
  }

  // --- Deals ---
  @Post('deals')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  @SetUsageType('deals')
  async createDeal(@Req() req: any, @Body() data: CreateDealDto) {
    return this.crmService.createDeal(req.user.organizationId, { ...data, ownerId: data.ownerId || req.user.userId });
  }

  @Get('deals')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getDeals(
    @Req() req: any, 
    @Query('pipelineId') pipelineId?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.crmService.getDeals(req.user, { pipelineId, search, page, limit });
  }

  @Get('deals/:id')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getDealById(@Req() req: any, @Param('id') id: string) {
    return this.crmService.getDealById(req.user.organizationId, id);
  }

  @Put('deals/:id')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async updateDeal(@Req() req: any, @Param('id') id: string, @Body() data: Partial<CreateDealDto>) {
    return this.crmService.updateDeal(req.user.organizationId, id, data);
  }

  @Delete('deals/:id')
  @Roles(Role.Admin, Role.Owner)
  async deleteDeal(@Req() req: any, @Param('id') id: string) {
    return this.crmService.deleteDeal(req.user.organizationId, id);
  }

  @Patch('deals/:id/move-stage')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async moveDealStage(@Req() req: any, @Param('id') id: string, @Body('stageId') stageId: string) {
    return this.crmService.moveDealStage(req.user.organizationId, id, stageId);
  }

  // --- Activities & Timeline ---
  @Post('activities')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async logActivity(@Req() req: any, @Body() data: CreateActivityDto) {
    return this.crmService.logActivity(req.user.organizationId, { ...data, ownerId: data.ownerId || req.user.userId });
  }

  @Get('activities')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getActivities(
    @Req() req: any,
    @Query('contactId') contactId?: string,
    @Query('dealId') dealId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.crmService.getActivities(req.user.organizationId, { contactId, dealId, page, limit });
  }

  @Put('activities/:id')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async updateActivity(@Req() req: any, @Param('id') id: string, @Body() data: Partial<CreateActivityDto>) {
    return this.crmService.updateActivity(req.user.organizationId, id, data);
  }

  @Delete('activities/:id')
  @Roles(Role.Admin, Role.Owner)
  async deleteActivity(@Req() req: any, @Param('id') id: string) {
    return this.crmService.deleteActivity(req.user.organizationId, id);
  }

  @Get('timeline')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getTimeline(@Req() req: any, @Query('contactId') contactId?: string, @Query('dealId') dealId?: string) {
    return this.crmService.getTimeline(req.user.organizationId, contactId, dealId);
  }

  // --- Notes ---
  @Post('notes')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async addNote(@Req() req: any, @Body() data: CreateNoteDto) {
    return this.crmService.addNote(req.user.organizationId, { ...data, ownerId: data.ownerId || req.user.userId });
  }

  @Put('notes/:id')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async updateNote(@Req() req: any, @Param('id') id: string, @Body() data: Partial<CreateNoteDto>) {
    return this.crmService.updateNote(req.user.organizationId, id, data);
  }

  @Delete('notes/:id')
  @Roles(Role.Admin, Role.Owner)
  async deleteNote(@Req() req: any, @Param('id') id: string) {
    return this.crmService.deleteNote(req.user.organizationId, id);
  }

  // --- WhatsApp Integration ---
  @Post('contacts/:id/whatsapp')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async sendWhatsAppMessage(@Param('id') id: string, @Body('message') message: string) {
    return this.crmService.sendWhatsAppAsync(id, message);
  }

  // --- Team Members ---
  @Get('team-members')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getTeamMembers(@Req() req: any) {
    return this.crmService.getTeamMembers(req.user.organizationId);
  }

  @Post('team-members')
  @Roles(Role.Admin, Role.Owner)
  @SetUsageType('members')
  async addTeamMember(@Req() req: any, @Body() body: { userId: string, role: string }) {
    return this.crmService.addTeamMember(req.user.organizationId, body.userId, body.role);
  }
}
