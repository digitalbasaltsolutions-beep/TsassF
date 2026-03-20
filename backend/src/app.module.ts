import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from './shared/redis/redis.module';
import { TenantPlugin } from './shared/database/tenant.plugin';
import { UsersModule } from './core/users/users.module';
import { OrganizationsModule } from './core/organizations/organizations.module';
import { AuthModule } from './core/auth/auth.module';
import { BillingModule } from './core/billing/billing.module';
import { CrmModule } from './modules/crm/crm.module';
import { NotificationsModule } from './core/notifications/notifications.module';
import { EcommerceModule } from './modules/ecommerce/ecommerce.module';
import { AdminModule } from './core/admin/admin.module.js';
import { AnalyticsModule } from './shared/analytics/analytics.module.js';
import { MarketingModule } from './modules/marketing/marketing.module.js';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module.js';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100,
    }]),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(TenantPlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    UsersModule,
    OrganizationsModule,
    AuthModule,
    BillingModule,
    CrmModule,
    NotificationsModule,
    EcommerceModule,
    AdminModule,
    AnalyticsModule,
    MarketingModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
