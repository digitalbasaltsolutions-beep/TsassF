import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard.js';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsappController {
  @Get()
  getWhatsappInfo() {
    return { data: [], meta: { total: 0, page: 1, limit: 10 } };
  }
}
