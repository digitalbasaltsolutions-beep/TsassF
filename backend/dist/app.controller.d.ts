import { AppService } from './app.service';
import { RedisService } from './shared/redis/redis.service';
import { Connection } from 'mongoose';
export declare class AppController {
    private readonly appService;
    private readonly redisService;
    private connection;
    constructor(appService: AppService, redisService: RedisService, connection: Connection);
    getHello(): string;
    getHealth(): Promise<{
        status: string;
        services: {
            database: string;
            cache: string;
        };
        uptime: number;
        timestamp: string;
    }>;
}
