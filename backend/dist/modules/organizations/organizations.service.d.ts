import { Model } from 'mongoose';
import { Organization } from './schemas/organization.schema';
import { Membership } from './schemas/membership.schema';
export declare class OrganizationsService {
    private orgModel;
    private membershipModel;
    constructor(orgModel: Model<Organization>, membershipModel: Model<Membership>);
    createOrganization(name: string, ownerId: string): Promise<Organization>;
    getUserOrganizations(userId: string): Promise<Organization[]>;
}
