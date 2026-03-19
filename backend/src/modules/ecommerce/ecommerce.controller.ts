import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { Roles } from '../../core/auth/decorators/roles.decorator';
import { Role } from '../../shared/constants/roles.enum';

@Controller('ecommerce')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EcommerceController {
  constructor(private readonly ecommerceService: EcommerceService) {}

  @Get('products')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getProducts() {
    return this.ecommerceService.getProducts();
  }

  @Post('products')
  @Roles(Role.Admin, Role.Owner)
  async createProduct(@Body() data: any) {
    return this.ecommerceService.createProduct(data);
  }

  @Get('orders')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async getOrders() {
    return this.ecommerceService.getOrders();
  }

  @Post('orders')
  @Roles(Role.Admin, Role.Owner, Role.Member)
  async createOrder(@Body() data: any) {
    return this.ecommerceService.createOrder(data);
  }

  @Put('orders/:id/status')
  @Roles(Role.Admin, Role.Owner)
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ecommerceService.updateOrderStatus(id, status);
  }
}
