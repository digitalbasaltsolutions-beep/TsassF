"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const redis_service_1 = require("./shared/redis/redis.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AppController = class AppController {
    appService;
    redisService;
    connection;
    constructor(appService, redisService, connection) {
        this.appService = appService;
        this.redisService = redisService;
        this.connection = connection;
    }
    getHello() {
        return this.appService.getHello();
    }
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
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [app_service_1.AppService,
        redis_service_1.RedisService,
        mongoose_2.Connection])
], AppController);
//# sourceMappingURL=app.controller.js.map