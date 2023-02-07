import './bootstrap';

import { Command } from 'commander';

import pkg from '../package.json';
import {
  findPortionImages,
  generateEnv,
  generateKey,
  generateVapidKeys,
  hashPassword,
} from './commands';

const run = async () => {
  const program = new Command();

  program.name('Intake24 CLI');
  program.version(pkg.version);

  program
    .command('generate-env')
    .description('Generate .env files for each application with fresh secrets and keys.')
    .option('-f, --force', 'override existing .env files')
    .action(async (cmd) => {
      await generateEnv(cmd);
    });

  program
    .command('generate-key')
    .description('Generate random key with 64 chars default length.')
    .option('-l, --length [length]', 'key length', '64')
    .action(async (cmd) => {
      await generateKey(cmd);
    });

  program
    .command('generate-vapid-keys')
    .description('Generate VAPID key pair.')
    .action(async () => {
      await generateVapidKeys();
    });

  program
    .command('hash-password')
    .description(
      'Generate a BCrypt password hash to create/update user passwords manually in the database.'
    )
    .argument('<password>', 'Plain text password to hash.')
    .action(async (pwd) => {
      await hashPassword(pwd);
    });

  program
    .command('find-portion-images')
    .description(
      'Find portion size images that represent the amount of food having energy value closest to the specified target value'
    )
    .requiredOption('-c, --config [path]', 'config file path')
    .requiredOption('-o, --output [path]', 'output file path')
    .action(async (pwd) => {
      await findPortionImages(pwd);
    });

  await program.parseAsync(process.argv);
};

run()
  .catch((err) => {
    console.error(err instanceof Error ? err.stack : err);

    process.exitCode = process.exitCode ?? 1;
    process.exit();
  })
  .finally(() => {
    process.exitCode = process.exitCode ?? 0;
    process.exit();
  });
