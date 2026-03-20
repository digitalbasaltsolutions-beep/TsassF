import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from '../organizations/schemas/organization.schema';
import { User } from '../users/schemas/user.schema';
import { Membership } from '../organizations/schemas/membership.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Organization.name) private orgModel: Model<Organization>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
  ) {}

  async getAllOrganizations() {
    return this.orgModel.find().exec();
  }

  async getAllUsers() {
    return this.userModel.find({}, { passwordHash: 0 }).exec();
  }

  async deleteOrganization(id: string) {
    const org = await this.orgModel.findById(id);
    if (!org) throw new NotFoundException('Organization not found');

    // Cascade delete memberships
    await this.membershipModel.deleteMany({ organizationId: org._id });
    
    // Delete the org
    await org.deleteOne();
    
    return { success: true };
  }

  async getGlobalStats() {
    const orgCount = await this.orgModel.countDocuments();
    const userCount = await this.userModel.countDocuments();
    return {
      totalOrganizations: orgCount,
      totalUsers: userCount,
      status: 'operational',
    };
  }
}
