import { pick } from 'lodash';
import request from 'supertest';

import type { SurveyRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/surveys';
  const permissions = ['surveys', 'surveys|create'];

  let input: SurveyRequest;
  let output: SurveyRequest;

  beforeAll(async () => {
    input = mocker.system.survey();
    output = {
      ...input,
      supportEmail: input.supportEmail.toLowerCase(),
      userCustomFields: false,
      userPersonalIdentifiers: false,
    };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 400 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, [
        'slug',
        'name',
        'state',
        'startDate',
        'endDate',
        'surveySchemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'storeUserSessionOnServer',
        'surveySchemeOverrides',
      ]);
    });

    it('should return 400 for invalid input data', async () => {
      const invalidInput = {
        slug: null,
        name: [2, 0],
        state: 10,
        startDate: 'notValidDate',
        endDate: 100,
        surveySchemeId: '999999',
        locale: 10,
        supportEmail: 'thisIsNotValidEmail',
        allowGenUsers: 'no',
        numberOfSubmissionsForFeedback: 'number',
        storeUserSessionOnServer: 'yes',
        maximumDailySubmissions: 'NaN',
        minimumSubmissionInterval: { nan: 5 },
        authUrlTokenCharset: 'abcabc',
        authUrlTokenLength: 'this is not a number',
        searchSortingAlgorithm: 'invalid-search-algorithm',
        searchMatchScoreWeight: 500,
        surveySchemeOverrides: {
          meals: ['shouldBeProperlyFormatMealList'],
          prompts: 'invalidPrompts',
        },
      };

      const fields = [
        'slug',
        'name',
        'state',
        'startDate',
        'endDate',
        'surveySchemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'numberOfSubmissionsForFeedback',
        'storeUserSessionOnServer',
        'maximumDailySubmissions',
        'minimumSubmissionInterval',
        'authUrlTokenCharset',
        'authUrlTokenLength',
        'searchSortingAlgorithm',
        'searchMatchScoreWeight',
        'surveySchemeOverrides',
      ];

      await suite.sharedTests.assertInvalidInput('post', url, fields, { input: invalidInput });
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(pick(body, Object.keys(output))).toEqual(output);
      expect(body.ownerId).toBe(suite.data.system.user.id);
      expect(status).toBe(201);
    });

    it('should return 400 for duplicate slug', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['slug'], {
        input: { ...mocker.system.survey(), slug: input.slug },
      });
    });

    it('should return 400 for duplicate name', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['name'], {
        input: { ...mocker.system.survey(), name: input.name },
      });
    });
  });
};
