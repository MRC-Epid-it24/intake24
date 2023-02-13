import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
} from '@simplewebauthn/typescript-types';

import type { MFAProvider } from '../../../security';
import type { OmitAndOptional } from '../../common';

export type MFADeviceAttributes = {
  id: string;
  userId: string;
  provider: MFAProvider;
  name: string;
  secret: string;
  preferred: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MFADeviceCreationAttributes = OmitAndOptional<
  MFADeviceAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'preferred'
>;

export type MFAAuthenticatorAttributes = {
  id: string;
  deviceId: string;
  publicKey: Uint8Array;
  counter: string;
  deviceType: CredentialDeviceType;
  backedUp: boolean;
  transports: AuthenticatorTransportFuture[];
  createdAt: Date;
  updatedAt: Date;
};

export type MFAAuthenticatorCreationAttributes = Omit<
  MFAAuthenticatorAttributes,
  'createdAt' | 'updatedAt'
>;
