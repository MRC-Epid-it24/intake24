import './bootstrap';
import { Command } from 'commander';
import pkg from '../package.json';

const run = async () => {
  const program = new Command();

  program.name('cli');
  program.version(pkg.version);
  program.requiredOption('-t, --task <task>', 'specify task').action(async (cmd) => {
    console.log(cmd);
  });

  await program.parseAsync(process.argv);
};

run()
  .catch((err) => {
    console.error(err);

    process.exitCode = process.exitCode ?? 1;
    process.exit();
  })
  .finally(() => {
    process.exitCode = process.exitCode ?? 0;
    process.exit();
  });
