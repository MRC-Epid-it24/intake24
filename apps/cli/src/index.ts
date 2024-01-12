import './bootstrap';

import { Argument, Command, Option } from 'commander';
import * as process from 'process';

import buildFrLocaleCommand from '@intake24/cli/commands/fr-inca3/build-fr-locale-command';

import pkg from '../package.json';
import {
  extractCategories,
  findPortionImages,
  generateEnv,
  generateKey,
  generateVapidKeys,
  hashPassword,
  packageExportV3,
  packageImportV4,
} from './commands';
import {
  conflictResolutionOptions,
  importerSpecificModulesExecutionOptions,
} from './commands/packager/importer-v4';

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

  const skipFoodsOption = new Option(
    '-sf, --skip-foods [food-ids...]',
    'Skip foods having these codes (typically for debug purposes)'
  );

  skipFoodsOption.required = true;

  program
    .command('export-package')
    .description('Export food data into a portable format')
    .addArgument(new Argument('<version>', 'Intake24 API version').choices(['v3', 'v4']))
    .option(
      '-as, --as-served [set-ids...]',
      'Export as served portion size images for given set identifiers'
    )
    .addOption(skipFoodsOption)
    .requiredOption('-l, --locale <locale-ids...>', 'Export all data for the given locale ids')
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

  const conflictResolutionOption = new Option(
    '-c, --on-conflict [on-conflict-option]',
    'Conflict resolution strategy'
  ).choices(conflictResolutionOptions);

  const specificModulesExecutionOption = new Option(
    '-m, --modules-for-execution [modules-for-execution-option...]',
    'Specific modules to execute'
  ).choices(importerSpecificModulesExecutionOptions);

  conflictResolutionOption.required = true;
  specificModulesExecutionOption.required = false;

  program
    .command('import-package')
    .description('Import food data from a portable format')
    .addArgument(new Argument('<version>', 'Intake24 API version').choices(['v3', 'v4']))
    .addArgument(new Argument('<package-file>', 'Input package file path'))
    .addOption(conflictResolutionOption)
    .addOption(specificModulesExecutionOption)
    .action(async (version, inputFilePath, options) => {
      switch (version) {
        case 'v3':
          throw new Error('Not implemented');
        case 'v4':
          await packageImportV4(version, inputFilePath, options);
          return;
        default:
          throw new Error(`Unexpected version option: ${version}`);
      }
    });

  program
    .command('extract-categories')
    .description('Generate a global category list')
    .argument('<locale>', 'Locale ID')
    .requiredOption('-o, --output-path [output path]', 'Output file path')
    .action(async (localeId, options) => {
      await extractCategories(localeId, options);
    });

  program
    .command('build-fr-locale')
    .description('Build French locale')
    .requiredOption('-i, --input-path [input path]', 'Source file path')
    .requiredOption('-o, --output-path [output path]', 'Output file path')
    .action(async (options) => {
      await buildFrLocaleCommand(options);
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
