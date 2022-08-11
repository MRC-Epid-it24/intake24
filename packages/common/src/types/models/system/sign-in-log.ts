import type { OmitAndOptional } from '../../common';

export type SignInLogAttributes = {
  id: string;
  userId: string | null;
  date: Date;
  remoteAddress: string | null;
  provider: string;
  providerKey: string;
  successful: boolean;
  message: string | null;
  userAgent: string | null;
};

export type SignInLogCreationAttributes = OmitAndOptional<
  SignInLogAttributes,
  'id',
  'date' | 'remoteAddress' | 'userId' | 'message' | 'userAgent'
>;
