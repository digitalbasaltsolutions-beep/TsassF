import { OrganizationsService } from './organizations.service.js';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    getMyOrganizations(req: any): Promise<import("./schemas/organization.schema.js").Organization[]>;
    getOrganization(id: string): Promise<import("./schemas/organization.schema.js").Organization | null>;
    getMembers(id: string): Promise<import("./schemas/membership.schema.js").Membership[]>;
    create(data: {
        name: string;
    }, req: any): Promise<import("./schemas/organization.schema.js").Organization>;
}
