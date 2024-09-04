import './bootstrap';

import { Argument, Command, Option } from 'commander';

import buildFrAlbaneLocaleCommand from '@intake24/cli/commands/fr-albane/build-fr-albane-command';
import buildFrInca3LocaleCommand from '@intake24/cli/commands/fr-inca3/build-fr-locale-command';
import convertDrinkScale from '@intake24/cli/commands/svg-converters/convert-drink-scale';
import convertImageMap from '@intake24/cli/commands/svg-converters/convert-image-map';

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
  searchTest,
} from './commands';
import {
  conflictResolutionOptions,
  importerSpecificModulesExecutionOptions,
} from './commands/packager/importer-v4';

async function run() {
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
      'Generate a BCrypt password hash to create/update user passwords manually in the database.',
    )
    .argument('<password>', 'Plain text password to hash.')
    .action(async (pwd) => {
      await hashPassword(pwd);
    });

  program
    .command('find-portion-images')
    .description(
      'Find portion size images that represent the amount of food having energy value closest to the specified target value',
    )
    .requiredOption('-c, --config [path]', 'config file path')
    .requiredOption('-o, --output [path]', 'output file path')
    .action(async (pwd) => {
      await findPortionImages(pwd);
    });

  const skipFoodsOption = new Option(
    '-sf, --skip-foods [food-ids...]',
    'Skip foods having these codes (typically for debug purposes)',
  );

  skipFoodsOption.required = true;

  program
    .command('export-package')
    .description('Export food data into a portable format')
    .addArgument(new Argument('<version>', 'Intake24 API version').choices(['v3', 'v4']))
    .option(
      '-as, --as-served [set-ids...]',
      'Export as served portion size images for given set identifiers',
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
    'Conflict resolution strategy',
  ).choices(conflictResolutionOptions);

  const specificModulesExecutionOption = new Option(
    '-m, --modules-for-execution [modules-for-execution-option...]',
    'Specific modules to execute',
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
    .description('Build French INCA3 locale')
    .requiredOption('-i, --input-path [input path]', 'Source file path')
    .requiredOption('-o, --output-path [output path]', 'Output file path')
    .action(async (options) => {
      await buildFrInca3LocaleCommand(options);
    });

  program
    .command('build-fr-albane')
    .description('Build French Albane locale')
    .requiredOption('-i, --input-path [input path]', 'Source file path')
    .requiredOption('-o, --output-path [output path]', 'Output file path')
    .action(async (options) => {
      await buildFrAlbaneLocaleCommand(options);
    });

  const volumeMethodOption = new Option('-m, --volume-method [volume-method]', 'Volume estimation method')
    .choices(['lookUpTable', 'cylindrical']);

  volumeMethodOption.mandatory = true;

  program
    .command('convert-drink-scale')
    .description('Convert legacy SVG drink scale data to Intake24 package format')
    .requiredOption('-id, --set-id [set-id]', 'Drinkware set ID')
    .requiredOption('-d, --description [description]', 'Drinkware set description')
    .requiredOption('-svg, --selection-svg [selection-svg]', 'Selection image map SVG')
    .requiredOption(
      '-img, --selection-base-image [selection-base-image]',
      'Selection image map base image',
    )
    .requiredOption('-s, --scales-csv [scales-csv]', 'Drink scales description CSV')
    .requiredOption('-o, --output-dir [output-dir]', 'Output package directory')
    .addOption(volumeMethodOption)
    .requiredOption('-l, --language [language]', 'Language code for labels and descriptions')
    .option(
      '-ow, --overwrite',
      'Overwrite existing records in destination package directory',
      false,
    )
    .action(async (options) => {
      await convertDrinkScale(options);
    });

  program
    .command('convert-image-map')
    .description('Convert legacy SVG image map data to Intake24 package format')
    .requiredOption('-id, --id [image map ID]>', 'Image map ID')
    .requiredOption('-d, --description [description]', 'Image map description')
    .requiredOption('-svg, --svg-path [SVG path]', 'Image map SVG')
    .requiredOption('-img, --base-image-path [base image path]', 'Image map base image')
    .requiredOption('-o, --output-dir [output directory]', 'Output package directory')
    .option(
      '-ow, --overwrite',
      'Overwrite existing records in destination package directory',
      false,
    )
    .action(async (options) => {
      await convertImageMap(options);
    });

  program
    .command('search-test')
    .description('Test search quality of the system')
    .requiredOption('-t, --term <term>', 'Search term')
    .requiredOption('-p, --path <path>', 'Jsonl file path')
    .action(async (cmd) => {
      await searchTest(cmd);
    });

  await program.parseAsync(process.argv);
}

run()
  .catch((err) => {
    console.error(err instanceof Error ? err.stack : err);

    process.exit(process.exitCode ?? 1);
  })
  .finally(() => {
    process.exit(process.exitCode ?? 0);
  });
