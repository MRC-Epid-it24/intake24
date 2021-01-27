export type RefreshToken = {
  id: string;
  userId: number;
  revoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
