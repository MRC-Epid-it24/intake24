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
};

export const role = (): RoleInput => {
  const displayName = faker.random.words(2);
  const name = faker.helpers.slugify(displayName);
  const description = faker.lorem.words(10);

  return { name, displayName, description };
};
