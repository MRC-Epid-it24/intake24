import fs from 'fs';
import { resolve } from 'node:path';
import config from '../config/filesystem';

export const mix = (file: string): string => {
  const contents = fs.readFileSync(resolve(`${config.local.public}/mix-manifest.json`), {
    encoding: 'utf8',
  });
  const manifest = JSON.parse(contents);

  return manifest[file] ?? file;
};
