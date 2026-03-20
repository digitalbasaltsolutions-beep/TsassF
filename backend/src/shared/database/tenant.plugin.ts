import { Schema } from 'mongoose';
import { ClsServiceManager } from 'nestjs-cls';
import { Role } from '../constants/roles.enum';

export function TenantPlugin(schema: Schema) {
  schema.pre('save', async function (this: any) {
    const cls = ClsServiceManager.getClsService();
    if (cls && cls.isActive()) {
      const organizationId = cls.get('organizationId');
      const userId = cls.get('userId');
      const role = cls.get('role');

      // SuperAdmin bypass
      if (role === Role.SuperAdmin) return;

      if (this.isNew) {
        if (organizationId && !this.get('organizationId')) {
          this.set('organizationId', organizationId);
        }
        if (userId && !this.get('createdBy')) {
          this.set('createdBy', userId);
        }
      }
    }
  });

  const types = ['find', 'findOne', 'findOneAndDelete', 'findOneAndRemove', 'findOneAndUpdate', 'count', 'countDocuments', 'update', 'updateOne', 'updateMany'];
  
  types.forEach((type) => {
    schema.pre(type as any, async function (this: any) {
      // Skip for global platform collections
      const globalCollections = ['users', 'organizations', 'subscriptions'];
      const collectionName = (this.model || this).collection.name;
      if (globalCollections.includes(collectionName)) return;

      const cls = ClsServiceManager.getClsService();
      if (cls && cls.isActive()) {
        const organizationId = cls.get('organizationId');
        const role = cls.get('role');

        if (role === Role.SuperAdmin) return;
        
        // Soft delete filtering: exclude anything that has a deletedAt timestamp
        this.where({ deletedAt: null });

        if (organizationId) {
          const query = this.getQuery();
          if (!query.organizationId) {
            this.where({ organizationId });
          }
        } else {
          // IMPORTANT: If we are in login flow, we won't have userId or organizationId.
          // We only enforce fail-safe if we have a userId but NO organizationId (active user sessions)
          // or if we decide specific models MUST always have it.
          const userId = cls.get('userId');
          if (userId) {
            this.where({ organizationId: '000000000000000000000000' });
          }
        }
      }
    });
  });
}
