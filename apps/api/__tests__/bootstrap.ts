import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const env = dotenv.config({ path: `${__dirname}/.env-test` });
dotenvExpand.expand(env);
