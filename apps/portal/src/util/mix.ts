import fs from 'fs';
import { resolve } from 'node:path';
import config from '../config/app';

export const mix = (file: string): string => {
  const contents = fs.readFileSync(resolve(`${config.public}/mix-manifest.json`), {
    encoding: 'utf8',
  });
  const manifest = JSON.parse(contents);

  return manifest[file] ?? file;
};
