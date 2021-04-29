import type { Role, User } from '.';

export type Permission = {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PermissionAssociations = {
  roles?: Role[];
  users?: User[];
};
