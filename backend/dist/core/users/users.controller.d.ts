import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    completeOnboarding(req: any): Promise<import("./schemas/user.schema").User | null>;
}
