import { PlanType } from '../schemas/subscription.schema';

export const PLAN_LIMITS = {
  [PlanType.Free]: {
    contacts: 50,
    deals: 10,
    members: 2,
    pipelines: 1,
  },
  [PlanType.Pro]: {
    contacts: Infinity,
    deals: Infinity,
    members: Infinity,
    pipelines: Infinity,
  },
  [PlanType.Enterprise]: {
    contacts: Infinity,
    deals: Infinity,
    members: Infinity,
    pipelines: Infinity,
  },
};
