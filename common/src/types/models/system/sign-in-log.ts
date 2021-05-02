import type { OmitAndOptional } from '..';

export type SignInLogAttributes = {
  id: number;
  date: Date;
  remoteAddress: string | null;
  provider: string;
  providerKey: string;
  successful: boolean;
  userId: number | null;
  message: string | null;
  userAgent: string | null;
};

export type SignInLogCreationAttributes = OmitAndOptional<
  SignInLogAttributes,
  'id',
  'date' | 'remoteAddress' | 'userId' | 'message' | 'userAgent'
>;
