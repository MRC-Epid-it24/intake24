export type SignInLog = {
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
