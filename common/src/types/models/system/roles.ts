import type { Permission, User } from '.';

export type Role = {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RoleAssociations = {
  permissions?: Permission[];
  users?: User[];
};
