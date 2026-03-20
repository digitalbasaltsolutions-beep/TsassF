import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('my')
  async getMyOrganizations(@Request() req: any) {
    return this.organizationsService.getUserOrganizations(req.user.userId);
  }

  @Get(':id')
  async getOrganization(@Param('id') id: string) {
    return this.organizationsService.getOrganizationById(id);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.organizationsService.getMembers(id);
  }

  @Post()
  async create(@Body() data: { name: string }, @Request() req: any) {
    return this.organizationsService.createOrganization(data.name, req.user.userId);
  }
}
