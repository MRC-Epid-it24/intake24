import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { generateOpenApi } from '@ts-rest/open-api';

import contract from '@intake24/common/contracts';

import pkg from '../package.json';

const defaultRecall = {
  type: 'object',
  properties: {
    preMeals: { type: 'array', items: [] },
    meals: { type: 'object', properties: {
      preFoods: { type: 'array', items: [] },
      foods: { type: 'array', items: [] },
      postFoods: { type: 'array', items: [] },
    } },
    postMeals: { type: 'array', items: [] },
    submission: { type: 'array', items: [] },
  },
};

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
  }, {
    operationMapper: (operation, appRoute) => {
      /*
      * !!! TEMP HACKY REMOVAL OF HUGE RECALL SURVEY SCHEME OPEN API JSON SCHEME !!!
      * - size of the open-api json file grows from ~15MB to ~150MB, which is due to survey scheme recall JSON schema
      * - TODO: figure out how to maybe use JSON $refs with @ts-rest/open-api ?
      */
      if (appRoute.path === '/surveys/:slug/parameters') {
        operation.responses['200'].content['application/json'].schema.properties.surveyScheme.properties.prompts = { ...defaultRecall };
        return operation;
      }

      if (
        appRoute.path === '/admin/survey-schemes'
        || appRoute.path === '/admin/survey-schemes/:surveySchemeId'
        || appRoute.path === '/admin/survey-schemes/:surveySchemeId/edit'
        || appRoute.path === '/admin/survey-schemes/:surveySchemeId/copy'
      ) {
        if (operation.requestBody?.content['application/json']?.schema?.properties?.prompts)
          operation.requestBody.content['application/json'].schema.properties.prompts = { ...defaultRecall };

        if (operation.responses['200']?.content['application/json'].schema?.properties?.prompts)
          operation.responses['200'].content['application/json'].schema.properties.prompts = { ...defaultRecall };
        if (operation.responses['201']?.content['application/json'].schema?.properties?.prompts)
          operation.responses['201'].content['application/json'].schema.properties.prompts = { ...defaultRecall };
      }

      if (
        appRoute.path === '/admin/surveys'
        || appRoute.path === '/admin/surveys/:surveyId'
        || appRoute.path === '/admin/surveys/:surveyId/edit'
      ) {
        if (operation.requestBody?.content['application/json']?.schema?.properties?.surveySchemeOverrides?.properties?.prompts)
          operation.requestBody.content['application/json'].schema.properties.surveySchemeOverrides.properties.prompts = { type: 'array' };

        if (operation.responses['200']?.content['application/json'].schema?.properties?.surveySchemeOverrides?.properties?.prompts)
          operation.responses['200'].content['application/json'].schema.properties.surveySchemeOverrides.properties.prompts = { type: 'array' };
        if (operation.responses['201']?.content['application/json'].schema?.properties?.surveySchemeOverrides?.properties?.prompts)
          operation.responses['201'].content['application/json'].schema.properties.surveySchemeOverrides.properties.prompts = { type: 'array' };

        if (operation.responses['200']?.content['application/json'].schema?.properties?.surveyScheme?.properties?.prompts)
          operation.responses['200'].content['application/json'].schema.properties.surveyScheme.properties.prompts = { ...defaultRecall };
        if (operation.responses['201']?.content['application/json'].schema?.properties?.surveyScheme?.properties?.prompts)
          operation.responses['201'].content['application/json'].schema.properties.surveyScheme.properties.prompts = { ...defaultRecall };
      }

      if (appRoute.path === '/admin/survey-scheme-prompts/refs') {
        if (operation.responses['200']?.content['application/json'].schema?.properties?.schemes)
          operation.responses['200'].content['application/json'].schema.properties.schemes = { type: 'array' };
      }

      if (appRoute.path === '/admin/references/survey-schemes'
      ) {
        if (operation.responses['200']?.content['application/json'].schema?.properties?.data)
          operation.responses['200'].content['application/json'].schema.properties.data = { type: 'array' };
      }

      return operation;
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
