import { Permission, Role, User, Pagination } from '../../models';

export type UserRequest = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  multiFactorAuthentication?: boolean;
  permissions: number[];
  roles: number[];
};

export interface CreateUserRequest extends UserRequest {
  password: string;
  passwordConfirm?: string;
}

export type UpdateUserRequest = UserRequest;

export type UsersResponse = Pagination<User>;

export interface UserEntry extends User {
  permissions?: Permission[];
  roles?: Role[];
}

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
