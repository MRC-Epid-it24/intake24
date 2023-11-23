import { resolve } from 'node:path';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const env = dotenv.config({ path: resolve(__dirname, '.env-test') });
dotenvExpand.expand(env);
