"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_LIMITS = void 0;
const subscription_schema_1 = require("../schemas/subscription.schema");
exports.PLAN_LIMITS = {
    [subscription_schema_1.PlanType.Free]: {
        contacts: 50,
        deals: 10,
        members: 2,
        pipelines: 1,
    },
    [subscription_schema_1.PlanType.Pro]: {
        contacts: Infinity,
        deals: Infinity,
        members: Infinity,
        pipelines: Infinity,
    },
    [subscription_schema_1.PlanType.Enterprise]: {
        contacts: Infinity,
        deals: Infinity,
        members: Infinity,
        pipelines: Infinity,
    },
};
//# sourceMappingURL=plan-limits.js.map