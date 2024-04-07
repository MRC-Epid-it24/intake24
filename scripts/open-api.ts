import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { generateOpenApi } from '@ts-rest/open-api';

import contract from '@intake24/common/contracts';

import pkg from '../package.json';

async function main() {
  const document = generateOpenApi(contract, {
    info: {
      title: 'Intake24 API Reference',
      description: pkg.description,
      license: {
        name: pkg.license,
        url: 'https://opensource.org/license/apache-2-0',
      },
      version: pkg.version,
    },
    servers: [
      {
        url: 'https://api.example.com',
        description: 'Intake24 API instance',
      },
    ],
    components: {
      securitySchemes: {
        bearerHttpAuthentication: {
          description: 'Bearer token using a JWT',
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  });

  writeFileSync(
    resolve('docs', 'public', 'open-api.json'),
    JSON.stringify(document, null, 2),
    'utf8',
  );
}

main().catch((err) => {
  console.error(err);

  process.exitCode = process.exitCode ?? 1;
  process.exit();
});
