import { SetMetadata } from '@nestjs/common';

export const SetUsageType = (type: 'contacts' | 'deals' | 'members' | 'pipelines') => SetMetadata('usageType', type);
