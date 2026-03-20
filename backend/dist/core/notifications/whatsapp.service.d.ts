export declare class WhatsAppService {
    private readonly logger;
    send(phone: string, message: string): Promise<{
        success: boolean;
        timestamp: Date;
    }>;
}
