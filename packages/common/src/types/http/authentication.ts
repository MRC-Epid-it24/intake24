import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';

import type { MFAAuthChallenge, MFAProvider } from '@intake24/common/security';

import type { MFADeviceEntry } from './admin/mfa-devices';

export type LoginRequest = {
  email: string;
  password: string;
};

export type EmailLoginRequest = {
  email: string;
  password: string;
  survey: string;
  captcha?: string;
};

export type AliasLoginRequest = {
  username: string;
  password: string;
  survey: string;
  captcha?: string;
};

export type TokenLoginRequest = {
  token: string;
  captcha?: string;
};

export type LoginResponse = {
  accessToken: string;
};

export type ChallengeResponse = {
  surveyId: string;
  provider: 'captcha';
};

export type MFAAuthResponse = {
  challenge?: MFAAuthChallenge;
  devices: MFADeviceEntry[];
};

export type AdminAuthResponse = LoginResponse | MFAAuthResponse;
export type SurveyAuthResponse = LoginResponse | ChallengeResponse;

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
