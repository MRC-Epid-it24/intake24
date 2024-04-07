import { resolve } from 'node:path';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const options
  = process.env.NODE_ENV === 'test' ? { path: resolve(__dirname, '../__tests__/.env-test') } : undefined;

const dotEnv = dotenv.config(options);
dotenvExpand.expand(dotEnv);
