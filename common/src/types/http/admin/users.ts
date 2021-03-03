import { CustomField } from '../..';
import { Permission, Role, User, UserAssociations, Pagination } from '../../models';

export type UserInput = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  multiFactorAuthentication?: boolean;
  customFields?: CustomField[];
  permissions: number[];
  roles: number[];
};

export interface CreateUserInput extends UserInput {
  password: string;
}

export interface CreateUserRequest extends CreateUserInput {
  passwordConfirm: string;
}

export type UpdateUserInput = UserInput;

export type UpdateUserRequest = UpdateUserInput;

/*
 - for use of we want to allow updating password in Admin UI
export interface UpdateUserInput extends UserInput {
  password?: string;
}
export interface UpdateUserRequest extends UpdateUserInput {
  passwordConfirm?: string;
} */

export type UsersResponse = Pagination<User>;

export interface UserEntry extends User, Required<UserAssociations> {}

export type UserListEntry = Pick<User, 'id' | 'name' | 'email'>;

export type UserRefs = {
  permissions: Permission[];
  roles: Role[];
};

export type UserResponse = {
  data: UserEntry;
  refs: UserRefs;
};

export type CreateUserResponse = Pick<UserResponse, 'refs'>;

export type StoreUserResponse = Pick<UserResponse, 'data'>;

export type RespondentInput = {
  name?: string;
  email?: string;
  phone?: string;
  customFields?: CustomField[];
};

export interface CreateRespondentInput extends RespondentInput {
  userName: string;
  password: string;
}

export interface CreateRespondentRequest extends CreateRespondentInput {
  passwordConfirm: string;
}

export interface UpdateRespondentInput extends RespondentInput {
  password?: string;
}

export interface UpdateRespondentRequest extends UpdateRespondentInput {
  passwordConfirm?: string;
}

export type RespondentResponse = {
  userId: number;
  userName: string;
  surveyId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};
