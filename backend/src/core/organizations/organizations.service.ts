import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Organization } from './schemas/organization.schema';
import { Membership } from './schemas/membership.schema';
import { Role } from '../../shared/constants/roles.enum';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) private orgModel: Model<Organization>,
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
  ) {}

  async createOrganization(name: string, ownerId: string): Promise<Organization> {
    const org = new this.orgModel({ name, ownerId: new Types.ObjectId(ownerId) });
    const savedOrg = await org.save();

    await this.membershipModel.create({
      userId: new Types.ObjectId(ownerId),
      organizationId: savedOrg._id,
      role: Role.Owner,
    });

    return savedOrg;
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const memberships = await this.membershipModel.find({ userId: new Types.ObjectId(userId) }).exec();
    const orgIds = memberships.map(m => m.organizationId);
    return this.orgModel.find({ _id: { $in: orgIds } }).exec();
  }
}
