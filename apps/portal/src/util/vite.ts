import { resolve } from 'node:path';

import { existsSync, readFileSync } from 'fs-extra';

import config from '../config/filesystem';

const makeScriptTag = (url: string) =>
  '<script type="module" src=":url"></script>'.replace(':url', url);

const makeStylesheetTag = (url: string) =>
  '<link rel="stylesheet" href=":url" />'.replace(':url', url);

const makeTag = (url: string) =>
  url.match(/\.(css|sass|scss)$/)?.length ? makeStylesheetTag(url) : makeScriptTag(url);

export const vite = (asset: string | string[], buildDir = 'build'): string => {
  const assets = Array.isArray(asset) ? asset : [asset];

  const hotPath = resolve(config.local.public, 'hot');
  if (existsSync(hotPath)) {
    const hot = readFileSync(hotPath, { encoding: 'utf8' });

    return [
      makeScriptTag(`${hot}/@vite/client`),
      ...assets.map((item) => makeTag(`${hot}/${item}`)),
    ].join('');
  }

  const segments = [config.local.public, buildDir, '.vite', 'manifest.json'].filter(
    Boolean
  ) as string[];

  const contents = readFileSync(resolve(...segments), { encoding: 'utf8' });
  const manifest = JSON.parse(contents);

  return assets.map((item) => makeTag(`${buildDir}/${manifest[item].file ?? item}`)).join('');
};
