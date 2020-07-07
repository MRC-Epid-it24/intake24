export type UserRequest = {
  name?: string;
  email?: string;
  phone?: string;
  simpleName?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  multiFactorAuthentication?: boolean;
  roles: string[];
};

export interface CreateUserRequest extends UserRequest {
  password: string;
}

export type UpdateUserRequest = UserRequest;

export type UserResponse = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  simpleName: string | null;
  emailNotifications: boolean;
  smsNotifications: boolean;
  multiFactorAuthentication: boolean;
  roles?: string[];
};

export type RespondentRequest = {
  name?: string;
  email?: string;
  phone?: string;
};

export interface CreateRespondentRequest extends RespondentRequest {
  userName: string;
  password: string;
}

export interface UpdateRespondentRequest extends RespondentRequest {
  password?: string;
}

export type RespondentResponse = {
  userId: number;
  userName: string;
  surveyId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};
