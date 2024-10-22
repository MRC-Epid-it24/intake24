import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';
import type { MFADeviceResponse } from './admin/mfa-devices';

import { z } from 'zod';

import type { MFAAuthChallenge, MFAProvider } from '@intake24/common/security';

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

export const loginResponse = z.object({ accessToken: z.string() });
export type LoginResponse = z.infer<typeof loginResponse>;
export const challengeResponse = z.object({ surveyId: z.string(), provider: z.literal('captcha') });
export type ChallengeResponse = z.infer<typeof challengeResponse>;

export type MFAAuthResponse = {
  challenge?: MFAAuthChallenge;
  devices: MFADeviceResponse[];
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
