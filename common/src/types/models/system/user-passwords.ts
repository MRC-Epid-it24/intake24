export type UserPassword = {
  userId: number;
  passwordHash: string;
  passwordSalt: string;
  passwordHasher: string;
};
