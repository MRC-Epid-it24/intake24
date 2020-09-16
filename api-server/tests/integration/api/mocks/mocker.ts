import { CreateUserRequest } from '@common/types/api/admin/users';
import faker from 'faker';

export type PermissionInput = {
  name: string;
  displayName: string;
  description: string;
};

export const permission = (): PermissionInput => {
  const displayName = faker.random.words(2);
  const name = faker.helpers.slugify(displayName);
  const description = faker.lorem.words(10);

  return { name, displayName, description };
};

export type RoleInput = {
  name: string;
  displayName: string;
  description: string;
  permissions: number[] | string[];
};

export const role = (): RoleInput => {
  const displayName = faker.random.words(2);
  const name = faker.helpers.slugify(displayName);
  const description = faker.lorem.words(10);
  const permissions: number[] = [];

  return { name, displayName, description, permissions };
};

export const user = (): CreateUserRequest => {
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const passwordConfirm = password;
  const phone = faker.phone.phoneNumber();
  const multiFactorAuthentication = false;
  const emailNotifications = faker.random.boolean();
  const smsNotifications = faker.random.boolean();

  const permissions: number[] = [];
  const roles: number[] = [];

  return {
    name,
    email,
    password,
    passwordConfirm,
    phone,
    multiFactorAuthentication,
    emailNotifications,
    smsNotifications,
    permissions,
    roles,
  };
};
