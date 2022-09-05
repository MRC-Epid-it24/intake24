import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { Options } from 'execa';
//@ts-expect-error missing types
import calver from 'calver';
import execa from 'execa';
import colors from 'picocolors';
import prompts from 'prompts';

import pkg from '../package.json';

const run = (bin: string, args: string[], opts: Options = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });

const step = (msg: string | number) => console.log(colors.cyan(msg));

const resolvePackages = (path: string) =>
  readdirSync(resolve(path)).map((item) => `${path}/${item}/package.json`);

const updatePackageVersion = (path: string, version: string) => {
  const pkgPath = resolve(path);
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  pkg.version = version;

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
};

const main = async () => {
  let targetVersion: string;

  const calVerFormat = 'yyyy.minor.patch';
  const targetVersions = ['calendar', 'minor', 'patch', 'rc', 'beta'].map((item) => {
    const value = calver.inc(calVerFormat, pkg.version, item);

    return { title: `${item} | ${value}`, value };
  });
  targetVersions.push({
    title: 'Custom release type',
    value: 'custom',
  });

  // Select release type
  const { version: calVersion } = await prompts({
    type: 'select',
    name: 'version',
    message: `Select release type for ${colors.bold(pkg.name)}`,
    choices: targetVersions,
    initial: 2,
  });

  if (calVersion === 'custom') {
    const { version: customVersion } = await prompts({
      type: 'text',
      name: 'version',
      message: `Provide custom release type for ${colors.bold(pkg.name)}`,
      initial: pkg.version,
      validate: (value) => !!value,
    });

    targetVersion = customVersion;
  } else targetVersion = calVersion;

  if (!targetVersion) return;

  // Update versions in package.json files
  step('\nUpdating versions in package.json files...');
  ['package.json', ...resolvePackages('apps'), ...resolvePackages('packages')]
    .filter((path) => existsSync(path))
    .forEach((path) => updatePackageVersion(path, targetVersion));

  step('\nGenerating the changelog...');
  await run('pnpm', ['changelog']);
  await run('pnpm', ['prettier', '--write', 'CHANGELOG.md']);

  const { yes: isChangelogCorrect } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: 'Is the changelog correct?',
  });

  if (!isChangelogCorrect) return;

  // Commit changes to the Git and create a tag.
  step('\nCommitting changes...');
  await run('git', ['add', 'CHANGELOG.md', '*package.json']);
  await run('git', ['commit', '-m', `release: v${targetVersion}`]);
  await run('git', ['tag', `v${targetVersion}`]);

  // Push to GitHub
  step('\nPushing to GitHub...');
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
  await run('git', ['push']);
};

main().catch((err) => {
  console.error(err);

  process.exitCode = process.exitCode ?? 1;
  process.exit();
});
