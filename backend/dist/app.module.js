"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const nestjs_cls_1 = require("nestjs-cls");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const bullmq_1 = require("@nestjs/bullmq");
const redis_module_1 = require("./shared/redis/redis.module");
const tenant_plugin_1 = require("./shared/database/tenant.plugin");
const users_module_1 = require("./core/users/users.module");
const organizations_module_1 = require("./core/organizations/organizations.module");
const auth_module_1 = require("./core/auth/auth.module");
const billing_module_1 = require("./core/billing/billing.module");
const crm_module_1 = require("./modules/crm/crm.module");
const notifications_module_1 = require("./core/notifications/notifications.module");
const ecommerce_module_1 = require("./modules/ecommerce/ecommerce.module");
const admin_module_js_1 = require("./core/admin/admin.module.js");
const analytics_module_js_1 = require("./shared/analytics/analytics.module.js");
const marketing_module_js_1 = require("./modules/marketing/marketing.module.js");
const whatsapp_module_js_1 = require("./modules/whatsapp/whatsapp.module.js");
const throttler_1 = require("@nestjs/throttler");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60,
                    limit: 100,
                }]),
            nestjs_cls_1.ClsModule.forRoot({
                global: true,
                middleware: { mount: true },
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                    connectionFactory: (connection) => {
                        connection.plugin(tenant_plugin_1.TenantPlugin);
                        return connection;
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            redis_module_1.RedisModule,
            users_module_1.UsersModule,
            organizations_module_1.OrganizationsModule,
            auth_module_1.AuthModule,
            billing_module_1.BillingModule,
            crm_module_1.CrmModule,
            notifications_module_1.NotificationsModule,
            ecommerce_module_1.EcommerceModule,
            admin_module_js_1.AdminModule,
            analytics_module_js_1.AnalyticsModule,
            marketing_module_js_1.MarketingModule,
            whatsapp_module_js_1.WhatsappModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map