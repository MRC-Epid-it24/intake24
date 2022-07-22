import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import config from '../config/filesystem';

export const vite = (asset: string, outputFolder?: string): string => {
  const segments = [config.local.public, outputFolder, 'manifest.json'].filter(Boolean) as string[];

  const contents = readFileSync(resolve(...segments), { encoding: 'utf8' });
  const manifest = JSON.parse(contents);

  return `/${[outputFolder, manifest[asset].file ?? asset].filter(Boolean).join('/')}`;
};
