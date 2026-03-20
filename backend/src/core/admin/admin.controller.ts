import { Controller, Get, Delete, Param, UseGuards, HttpCode, HttpStatus, Patch, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../shared/constants/roles.enum';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('organizations')
  @Roles(Role.SuperAdmin)
  async getOrganizations() {
    return this.adminService.getAllOrganizations();
  }

  @Get('users')
  @Roles(Role.SuperAdmin)
  async getUsers() {
    return this.adminService.getAllUsers();
  }

  @Delete('organizations/:id')
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async deleteOrganization(@Param('id') id: string) {
    return this.adminService.deleteOrganization(id);
  }

  @Patch('organizations/:id')
  @Roles(Role.SuperAdmin)
  async updateOrganization(
    @Param('id') id: string,
    @Body() data: { subscriptions?: string[], subscriptionPlan?: string }
  ) {
    return this.adminService.updateOrganization(id, data);
  }

  @Get('stats')
  @Roles(Role.SuperAdmin)
  async getStats() {
    return this.adminService.getGlobalStats();
  }
}
