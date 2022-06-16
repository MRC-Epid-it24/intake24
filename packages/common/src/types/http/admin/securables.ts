import type { UserListEntry } from '.';
import type { Pagination, UserSecurableAttributes } from '../../models';
import type { CreateUserInput } from './users';

export interface CreateUserWithSecurables
  extends Pick<CreateUserInput, 'email' | 'name' | 'phone'> {
  email: string;
  name?: string | null;
  phone?: string | null;
  actions: string[];
}

export type UpdateSecurableOwnerRequest = {
  userId: string | null;
};

export interface UserSecurableListEntry extends UserListEntry {
  securables: UserSecurableAttributes[];
}

export type UsersWithSecurablesResponse = Pagination<UserSecurableListEntry>;

export type AvailableUsersWithSecurablesResponse = UserListEntry[];
