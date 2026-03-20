"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    logger = new common_1.Logger('HTTP');
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const { method, url } = request;
        const now = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const response = ctx.getResponse();
            const delay = Date.now() - now;
            this.logger.log(JSON.stringify({
                level: 'info',
                message: 'Request successful',
                method,
                url,
                status: response.statusCode,
                delay: `${delay}ms`,
                timestamp: new Date().toISOString()
            }));
        }), (0, operators_1.map)(res => {
            let data = res;
            let meta = null;
            if (res && res.data !== undefined) {
                data = res.data;
                meta = res.meta || null;
            }
            return {
                success: true,
                data: data ?? {},
                meta: meta ?? {},
                error: null,
            };
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map