import { Permission, Role, User } from '../../models/system';
import { Pagination } from '../../models/pagination';

export type UserRequest = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  multiFactorAuthentication?: boolean;
  permissions: string[];
  roles: string[];
};

export interface CreateUserRequest extends UserRequest {
  password: string;
  passwordConfirm?: string;
}

export type UpdateUserRequest = UserRequest;

export interface UserResponse extends User {
  permissions?: Permission[];
  roles?: Role[];
}

export type UserListResponse = Pagination<User>;

export type UserEntryResponse = {
  data: UserResponse;
  refs: UserEntryRefs;
};

export type UserCreateResponse = Pick<UserEntryResponse, 'refs'>;

export type UserStoreResponse = Pick<UserEntryResponse, 'data'>;

export type UserEntryRefs = {
  permissions: Permission[];
  roles: Role[];
};

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
