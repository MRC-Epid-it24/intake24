import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';

import type { MFADeviceAttributes } from '@intake24/db';

export type MFADeviceEntry = Omit<MFADeviceAttributes, 'secret'>;

export type OTPRegistrationChallenge = {
  challengeId: string;
  qrCode: string;
  url: string;
};

export type OTPRegistrationVerificationRequest = {
  challengeId: string;
  name: string;
  token: string;
};

export type DuoRegistrationChallenge = {
  challengeId: string;
  challengeUrl: string;
};

export type DuoRegistrationVerificationRequest = {
  challengeId: string;
  name: string;
  token: string;
};

export type FIDORegistrationChallenge = PublicKeyCredentialCreationOptionsJSON;

export type FIDORegistrationVerificationRequest = {
  challengeId: string;
  name: string;
  response: RegistrationResponseJSON;
};

export type MFADevicesResponse = {
  status: boolean;
  devices: MFADeviceEntry[];
};
