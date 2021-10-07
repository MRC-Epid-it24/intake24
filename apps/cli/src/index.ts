import './bootstrap';
import { Command } from 'commander';
import pkg from '../package.json';
import { GenerateEnv } from './commands';

const run = async () => {
  const program = new Command();

  program.name('Intake24 CLI');
  program.version(pkg.version);

  program
    .command('generate-env')
    .description('Generate .env files for each application with fresh secrets and keys.')
    .option('-f, --force', 'override existing .env files')
    .action(async (cmd) => {
      await GenerateEnv(cmd);
    });

  await program.parseAsync(process.argv);
};

run()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);

    process.exitCode = process.exitCode ?? 1;
    process.exit();
  })
  .finally(() => {
    process.exitCode = process.exitCode ?? 0;
    process.exit();
  });
