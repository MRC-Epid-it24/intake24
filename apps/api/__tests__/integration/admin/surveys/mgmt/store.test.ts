import { faker } from '@faker-js/faker';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Op, Permission, Survey } from '@intake24/db';
import { surveyStaff } from '@intake24/common/security';
import ioc from '@intake24/api/ioc';

const { adminSurveyService } = ioc.cradle;

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidSurveyUrl: string;

  let survey: Survey;

  let input: {
    email: string;
    permissions: string[];
  };

  let nonSurveyPermissionIds: string[];

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
    });

    url = `${baseUrl}/${survey.id}/mgmt`;
    invalidSurveyUrl = `${baseUrl}/invalid-survey-id/mgmt`;

    const permissions = await adminSurveyService.getSurveyPermissions(survey.id);
    const ids = permissions.map(({ id }) => id);

    const nonSurveyPermissions = await Permission.findAll({ where: { id: { [Op.notIn]: ids } } });
    nonSurveyPermissionIds = nonSurveyPermissions.map(({ id }) => id);

    input = {
      email: 'newStaffEmail@example.com',
      permissions: ids,
    };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|mgmt');

    await suite.sharedTests.assertMissingAuthorization('post', url);
  });

  it(`should return 403 when missing 'surveys-mgmt' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    await suite.sharedTests.assertMissingAuthorization('post', url);
  });

  it(`should return 403 when missing 'surveys-mgmt' permission (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(survey.id));

    await suite.sharedTests.assertMissingAuthorization('post', url);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await suite.util.setPermission(['surveys|mgmt', surveyStaff(survey.id)]);

    await suite.sharedTests.assertMissingAuthorization('post', invalidSurveyUrl);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys|mgmt', surveyStaff(survey.id)]);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['email', 'permissions']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['email', 'permissions'], {
        input: {
          email: 'this-is-not-an-email',
          permissions: { name: 'not a valid permission' },
        },
      });
    });

    it('should return 422 for incorrect permissions / existing email account', async () => {
      const invalidPermissionIdx = faker.datatype.number({
        min: 0,
        max: nonSurveyPermissionIds.length,
      });

      await suite.sharedTests.assertInvalidInput('post', url, ['email', 'permissions'], {
        input: {
          email: suite.data.system.user.email,
          permissions: [nonSurveyPermissionIds[invalidPermissionIdx]],
        },
      });
    });

    it('should return 201 and empty response body', async () => {
      await suite.sharedTests.assertAcknowledged('post', url, { code: 201, input });
    });
  });
};
