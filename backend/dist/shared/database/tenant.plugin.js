"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantPlugin = TenantPlugin;
const nestjs_cls_1 = require("nestjs-cls");
const roles_enum_1 = require("../constants/roles.enum");
function TenantPlugin(schema) {
    schema.pre('save', async function () {
        const cls = nestjs_cls_1.ClsServiceManager.getClsService();
        if (cls && cls.isActive()) {
            const organizationId = cls.get('organizationId');
            const userId = cls.get('userId');
            const role = cls.get('role');
            if (role === roles_enum_1.Role.SuperAdmin)
                return;
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
        schema.pre(type, async function () {
            const globalCollections = ['users', 'organizations', 'subscriptions'];
            const collectionName = (this.model || this).collection.name;
            if (globalCollections.includes(collectionName))
                return;
            const cls = nestjs_cls_1.ClsServiceManager.getClsService();
            if (cls && cls.isActive()) {
                const organizationId = cls.get('organizationId');
                const role = cls.get('role');
                if (role === roles_enum_1.Role.SuperAdmin)
                    return;
                this.where({ deletedAt: null });
                if (organizationId) {
                    const query = this.getQuery();
                    if (!query.organizationId) {
                        this.where({ organizationId });
                    }
                }
                else {
                    const userId = cls.get('userId');
                    if (userId) {
                        this.where({ organizationId: '000000000000000000000000' });
                    }
                }
            }
        });
    });
}
//# sourceMappingURL=tenant.plugin.js.map