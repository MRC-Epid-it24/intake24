export type UserPasswordResetAttributes = {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPasswordResetCreationAttributes = Omit<
  UserPasswordResetAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
