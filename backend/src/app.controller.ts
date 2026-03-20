import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './shared/redis/redis.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
    @InjectConnection() private connection: Connection
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth() {
    const dbStatus = this.connection.readyState === 1 ? 'up' : 'down';
    const redisStatus = this.redisService.status === 'ready' ? 'up' : 'down';

    return {
      status: dbStatus === 'up' && redisStatus === 'up' ? 'operational' : 'degraded',
      services: {
        database: dbStatus,
        cache: redisStatus,
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}
