import { nanoid } from 'nanoid';

export type GenerateKeyArgs = { length?: string };

export default async (cmd: GenerateKeyArgs): Promise<void> => {
  const length = cmd.length ? Number.parseInt(cmd.length, 10) : 64;
  if (Number.isNaN(length) || length < 1)
    throw new Error('Provide positive number');

  process.stdout.write(`Key: ${nanoid(length)}\n`);
};
