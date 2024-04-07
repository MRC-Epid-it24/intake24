import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { Options } from 'execa';
// @ts-expect-error missing types
import calver from 'calver';
import execa from 'execa';
import colors from 'picocolors';
import prompts from 'prompts';

import pkg from '../package.json';

function run(bin: string, args: string[], opts: Options = {}) {
  return execa(bin, args, { stdio: 'inherit', ...opts });
}

const step = (msg: string | number) => console.log(colors.cyan(msg));

function resolvePackages(path: string) {
  return readdirSync(resolve(path)).map(item => `${path}/${item}/package.json`);
}

function updatePackageVersion(path: string, version: string) {
  const pkgPath = resolve(path);
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  pkg.version = version;

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

async function main() {
  let targetVersion: string;

  const calVerFormat = 'yyyy.minor.patch';
  const targetVersions = ['calendar', 'minor', 'patch', 'rc', 'beta'].reduce<
    { title: string; value: string }[]
  >((acc, item) => {
    try {
      const value = calver.inc(calVerFormat, pkg.version, item);

      acc.push({ title: `${item} | ${value}`, value });
    }
    catch (error) {
      //
    }

    return acc;
  }, []);

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
      validate: value => !!value,
    });

    targetVersion = customVersion;
  }
  else {
    targetVersion = calVersion;
  }

  if (!targetVersion)
    return;

  // Update versions in package.json files
  step('\nUpdating versions in package.json files...');
  ['package.json', ...resolvePackages('apps'), ...resolvePackages('packages')]
    .filter(path => existsSync(path))
    .forEach(path => updatePackageVersion(path, targetVersion));

  step('\nGenerating the changelog...');
  await run('pnpm', ['changelog']);

  const { yes: allGood } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: 'Is everything correct for push?',
  });

  if (!allGood)
    return;

  // Commit changes to the Git and create a tag.
  step('\nCommitting changes...');
  await run('git', ['add', '*package.json']);
  await run('git', ['commit', '-m', `release: v${targetVersion}`]);
  await run('git', ['tag', `v${targetVersion}`]);

  // Push to GitHub
  step('\nPushing to GitHub...');
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
  await run('git', ['push']);
}

main().catch((err) => {
  console.error(err);

  process.exitCode = process.exitCode ?? 1;
  process.exit();
});
