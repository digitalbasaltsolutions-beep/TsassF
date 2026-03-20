import { Model } from 'mongoose';
import { Organization } from './schemas/organization.schema.js';
import { Membership } from './schemas/membership.schema.js';
import { Role } from '../../shared/constants/roles.enum.js';
import { CrmService } from '../../modules/crm/crm.service.js';
export declare class OrganizationsService {
    private orgModel;
    private membershipModel;
    private crmService;
    constructor(orgModel: Model<Organization>, membershipModel: Model<Membership>, crmService: CrmService);
    createOrganization(name: string, ownerId: string): Promise<Organization>;
    getUserOrganizations(userId: string): Promise<Organization[]>;
    getOrganizationById(id: string): Promise<Organization | null>;
    getMembership(userId: string, organizationId: string): Promise<Membership | null>;
    getMembers(organizationId: string): Promise<Membership[]>;
    addMember(organizationId: string, userId: string, role?: Role): Promise<Membership>;
}
