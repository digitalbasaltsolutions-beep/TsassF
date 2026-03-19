import { Schema } from 'mongoose';
import { ClsServiceManager } from 'nestjs-cls';

export function TenantPlugin(schema: Schema) {
  schema.pre('save', async function (this: any) {
    const cls = ClsServiceManager.getClsService();
    if (cls && cls.isActive()) {
      const organizationId = cls.get('organizationId');
      const userId = cls.get('userId');

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
      const cls = ClsServiceManager.getClsService();
      if (cls && cls.isActive()) {
        const organizationId = cls.get('organizationId');
        // By default, if organizationId is in context, we enforce it
        // We use $and to not overwrite existing organizationId queries
        if (organizationId) {
          const query = this.getQuery();
          if (!query.organizationId) {
            this.where({ organizationId });
          }
        }
      }
    });
  });
}
