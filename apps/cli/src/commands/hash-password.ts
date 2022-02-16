import { PasswordBcrypt } from '@intake24/common/util';

export default async (password: string): Promise<void> => {
  const hasher = new PasswordBcrypt();
  const hash = await hasher.hash(password);

  process.stdout.write(`Hash: ${hash.hash}\n`);
  process.stdout.write(`Salt: ${hash.salt}\n`);
};
