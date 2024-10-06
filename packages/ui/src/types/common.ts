import type { UserSecurableAttributes } from '@intake24/common/types/http/admin';

export interface Permission {
  resource?: string;
  action?: string;
  ownerId?: string | null;
  securables?: UserSecurableAttributes[];
}
