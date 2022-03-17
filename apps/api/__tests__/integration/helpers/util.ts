import axios from 'axios';
import { faker } from '@faker-js/faker';
import fs, { ReadStream } from 'fs-extra';
import { Parser } from 'json2csv';
import { times } from 'lodash';
import path from 'path';
import { Permission, Role, User } from '@intake24/db';
import ioc from '@intake24/api/ioc';

const { fsConfig } = ioc.cradle;

/**
 * Set permissions for a testing role
 *
 * @param {(string | string[])} perm
 * @returns {Promise<void>}
 */
export const setPermission = async (
  perm: string | string[],
  roleName = 'test-role'
): Promise<void> => {
  const role = await Role.findOne({ where: { name: roleName } });

  if (!role) throw new Error('Missing mock role.');

  const name = Array.isArray(perm) ? perm : [perm];

  const permissions = await Permission.findAll({ where: { name } });

  if (name.length && name.length !== permissions.length)
    throw new Error('Missing mock permissions.');

  await role.$set('permissions', permissions);
};

/**
 * Set permissions for a testing user
 *
 * @param {(string | string[])} perm
 * @param {number} userId
 * @returns {Promise<void>}
 */
export const setUserPermission = async (perm: string | string[], userId: string): Promise<void> => {
  const user = await User.findByPk(userId);

  if (!user) throw new Error('Missing mock user.');

  const name = Array.isArray(perm) ? perm : [perm];

  const permissions = await Permission.findAll({ where: { name } });

  if (name.length && name.length !== permissions.length)
    throw new Error('Missing mock permissions.');

  await user.$set('permissions', permissions);
};

export const downloadImage = async (url: string, filename: string): Promise<string> => {
  const filePath = path.resolve(fsConfig.local.downloads, filename);
  const fileStream = fs.createWriteStream(filePath);

  const { data } = await axios.get<ReadStream>(url, { responseType: 'stream' });

  data.pipe(fileStream);

  return new Promise((resolve, reject) => {
    fileStream.on('finish', () => resolve(filePath));
    fileStream.on('error', () => reject());
  });
};

export const generateCSV = async (filename: string): Promise<string> => {
  const filePath = path.resolve(fsConfig.local.downloads, filename);

  const fields = ['userName', 'password', 'email', 'name', 'phone'];

  const data = times(10, () => ({
    userName: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    name: faker.name.firstName(),
    phone: faker.phone.phoneNumber(),
  }));

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);

  await fs.writeFile(filePath, csv, { encoding: 'utf-8' });

  return filePath;
};
