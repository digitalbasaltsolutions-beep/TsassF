import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        userId: any;
        email: any;
        organizationId: any;
        role: any;
    }>;
}
export {};
