import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Organization } from './schemas/organization.schema.js';
import { Membership } from './schemas/membership.schema.js';
import { Role } from '../../shared/constants/roles.enum.js';
import { CrmService } from '../../modules/crm/crm.service.js';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) private orgModel: Model<Organization>,
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
    @Inject(forwardRef(() => CrmService))
    private crmService: CrmService,
  ) {}

  async createOrganization(name: string, ownerId: string): Promise<Organization> {
    const org = new this.orgModel({ name, ownerId: new Types.ObjectId(ownerId) });
    const savedOrg = await org.save();

    await this.membershipModel.create({
      userId: new Types.ObjectId(ownerId),
      organizationId: savedOrg._id,
      role: Role.Owner,
    });

    // Auto-create default CRM Pipeline & Stages
    try {
      const pipeline = await this.crmService.createPipeline(savedOrg._id.toString(), {
        name: 'Sales Pipeline'
      });

      const defaultStages = [
        { name: 'Lead', order: 0, color: '#94a3b8' },
        { name: 'Qualified', order: 1, color: '#3b82f6' },
        { name: 'Proposal', order: 2, color: '#eab308' },
        { name: 'Won', order: 3, color: '#22c55e' }
      ];

      for (const stage of defaultStages) {
        await this.crmService.createStage(savedOrg._id.toString(), {
          ...stage,
          pipelineId: pipeline._id.toString()
        });
      }
    } catch (error) {
      console.error('Failed to create default pipeline:', error);
      // We don't want to fail org creation if CRM setup fails, but we should log it
    }

    return savedOrg;
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const memberships = await this.membershipModel.find({ userId: new Types.ObjectId(userId) }).exec();
    const orgIds = memberships.map(m => m.organizationId);
    return this.orgModel.find({ _id: { $in: orgIds } }).exec();
  }

  async getMembership(userId: string, organizationId: string): Promise<Membership | null> {
    return this.membershipModel.findOne({
      userId: new Types.ObjectId(userId),
      organizationId: new Types.ObjectId(organizationId),
    }).exec();
  }

  async getMembers(organizationId: string): Promise<Membership[]> {
    return this.membershipModel.find({ organizationId: new Types.ObjectId(organizationId) }).exec();
  }

  async addMember(organizationId: string, userId: string, role: Role = Role.Member): Promise<Membership> {
    return this.membershipModel.create({
      userId: new Types.ObjectId(userId),
      organizationId: new Types.ObjectId(organizationId),
      role,
    });
  }
}
