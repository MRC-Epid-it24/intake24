import './bootstrap';

import { Argument, Command, Option } from 'commander';
import * as process from 'process';

import pkg from '../package.json';
import {
  findPortionImages,
  generateEnv,
  generateKey,
  generateVapidKeys,
  hashPassword,
  packageExportV3,
  packageImportV4,
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

  const asServedOption = new Option(
    '-as, --as-served [set-ids...]',
    'Export as served portion size images for given set identifiers'
  );

  asServedOption.required = true;

  const localeOption = new Option(
    '-l, --locale <locale-ids...>',
    'Export all data for the given locale ids'
  );

  localeOption.required = true;

  program
    .command('export-package')
    .description('Export food data into a portable format')
    .addArgument(new Argument('<version>', 'Intake24 API version').choices(['v3', 'v4']))
    .addOption(asServedOption)
    .addOption(localeOption)
    .action(async (version, options) => {
      switch (version) {
        case 'v3':
          return await packageExportV3(version, options);
        case 'v4':
          throw new Error('Not implemented');
        default:
          throw new Error(`Unexpected version option: ${version}`);
      }
    });

  program
    .command('import-package')
    .description('Import food data from a portable format')
    .addArgument(new Argument('<version>', 'Intake24 API version').choices(['v3', 'v4']))
    .addArgument(new Argument('<package-file>', 'Input package file path'))
    .action(async (version, inputFilePath, options) => {
      switch (version) {
        case 'v3':
          throw new Error('Not implemented');
        case 'v4':
          return await packageImportV4(version, inputFilePath, options);
        default:
          throw new Error(`Unexpected version option: ${version}`);
      }
    });

  await program.parseAsync(process.argv);
};

run()
  .catch((err) => {
    console.error(err instanceof Error ? err.stack : err);

    process.exit(process.exitCode ?? 1);
  })
  .finally(() => {
    process.exit(process.exitCode ?? 0);
  });
