import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './shared/redis/redis.module';
import { TenantPlugin } from './shared/database/tenant.plugin';
import { UsersModule } from './core/users/users.module';
import { OrganizationsModule } from './core/organizations/organizations.module';
import { AuthModule } from './core/auth/auth.module';
import { BillingModule } from './core/billing/billing.module';
import { CrmModule } from './modules/crm/crm.module';
import { NotificationsModule } from './core/notifications/notifications.module';
import { EcommerceModule } from './modules/ecommerce/ecommerce.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
