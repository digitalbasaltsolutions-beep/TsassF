import { PlanType } from '../schemas/subscription.schema';

export const PLAN_LIMITS = {
  [PlanType.Free]: {
    contacts: 50,
    deals: 10,
    members: 2,
    pipelines: 1,
  },
  [PlanType.Pro]: {
    contacts: 1000,
    deals: 100,
    members: 10,
    pipelines: 5,
  },
  [PlanType.Enterprise]: {
    contacts: Infinity,
    deals: Infinity,
    members: Infinity,
    pipelines: Infinity,
  },
};
