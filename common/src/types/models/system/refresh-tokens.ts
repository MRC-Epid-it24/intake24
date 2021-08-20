export type RefreshTokenAttributes = {
  id: string;
  userId: string;
  revoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type RefreshTokenCreationAttributes = Omit<
  RefreshTokenAttributes,
  'createdAt' | 'updatedAt'
>;
