import type { UserSecurableAttributes } from '@intake24/db';

export interface Permission {
  resource?: string;
  action?: string;
  ownerId?: string;
  securables?: UserSecurableAttributes[];
}
