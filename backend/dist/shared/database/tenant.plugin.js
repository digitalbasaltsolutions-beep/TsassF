"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantPlugin = TenantPlugin;
const nestjs_cls_1 = require("nestjs-cls");
function TenantPlugin(schema) {
    schema.pre('save', function (next) {
        const cls = nestjs_cls_1.ClsServiceManager.getClsService();
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
        next();
    });
    const types = ['find', 'findOne', 'findOneAndDelete', 'findOneAndRemove', 'findOneAndUpdate', 'count', 'countDocuments', 'update', 'updateOne', 'updateMany'];
    types.forEach((type) => {
        schema.pre(type, function (next) {
            const cls = nestjs_cls_1.ClsServiceManager.getClsService();
            if (cls && cls.isActive()) {
                const organizationId = cls.get('organizationId');
                if (organizationId) {
                    const query = this.getQuery();
                    if (!query.organizationId) {
                        this.where({ organizationId });
                    }
                }
            }
            next();
        });
    });
}
//# sourceMappingURL=tenant.plugin.js.map