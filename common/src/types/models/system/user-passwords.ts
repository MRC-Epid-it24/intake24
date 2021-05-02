export type UserPasswordAttributes = {
  userId: number;
  passwordHash: string;
  passwordSalt: string;
  passwordHasher: string;
};
