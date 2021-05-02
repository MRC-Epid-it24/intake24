export type UserPasswordResetAttributes = {
  id: number;
  userId: number;
  token: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPasswordResetCreationAttributes = Omit<
  UserPasswordResetAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
