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

export type RespondentRequest = {
  name?: string;
  email?: string;
  phone?: string;
};

export interface CreateRespondentRequest extends RespondentRequest {
  userName: string;
  password: string;
  passwordConfirm?: string;
}

export interface UpdateRespondentRequest extends RespondentRequest {
  password?: string;
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
