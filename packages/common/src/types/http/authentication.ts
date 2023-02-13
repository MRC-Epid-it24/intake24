import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/typescript-types';

import type { MFAAuthChallenge, MFAProvider } from '@intake24/common/security';

import type { MFADeviceEntry } from './admin/mfa-devices';

export type EmailLoginRequest = {
  email: string;
  password: string;
};

export type AliasLoginRequest = {
  username: string;
  password: string;
  survey: string;
};

export type TokenLoginRequest = {
  token: string;
};

export type LoginResponse = {
  accessToken: string;
};

export type MFAAuthResponse = {
  challenge?: MFAAuthChallenge;
  devices: MFADeviceEntry[];
};

export type AuthResponse = LoginResponse | MFAAuthResponse;

export type OTPAuthenticationVerificationRequest = {
  challengeId: string;
  provider: MFAProvider;
  token: string;
};

export type DuoAuthenticationVerificationRequest = {
  challengeId: string;
  provider: MFAProvider;
  token: string;
};

export type FIDOAuthenticationChallenge = PublicKeyCredentialRequestOptionsJSON;

export type FIDOAuthenticationVerificationRequest = {
  challengeId: string;
  provider: MFAProvider;
  response: AuthenticationResponseJSON;
};

export type MFAAuthenticationVerificationRequest =
  | OTPAuthenticationVerificationRequest
  | DuoAuthenticationVerificationRequest
  | FIDOAuthenticationVerificationRequest;

export type MFAVerifyResponse = LoginResponse;

export type RefreshResponse = LoginResponse;
