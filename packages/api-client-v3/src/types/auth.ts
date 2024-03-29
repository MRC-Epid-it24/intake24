export interface SignInRequestV3 {
  email: string;
  password: string;
}

export interface SignInResponseV3 {
  refreshToken?: string;
}

export interface RefreshResponseV3 {
  accessToken?: string;
}

export interface CredentialsV3 {
  username: string;
  password: string;
}
