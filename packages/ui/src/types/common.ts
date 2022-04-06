import { UserSecurableAttributes } from '@intake24/common/types/models';

export interface Permission {
  resource?: string;
  action?: string;
  ownerId?: string;
  securables?: UserSecurableAttributes[];
}
