import { faker } from '@faker-js/faker';
import request from 'supertest';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Op, Permission, Survey } from '@intake24/db';
import { surveyStaff } from '@intake24/common/acl';
import ioc from '@intake24/api/ioc';

const { adminSurveyService } = ioc.cradle;

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidSurveyUrl: string;
  let invalidUserUrl: string;

  let survey: Survey;

  let userId: string;

  let input: { permissions: string[] };

  let nonSurveyPermissionIds: string[];

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
    });

    const userInput = mocker.system.user();
    const user = await ioc.cradle.adminUserService.create(userInput);
    userId = user.id;

    url = `${baseUrl}/${survey.id}/mgmt/${userId}`;
    invalidSurveyUrl = `${baseUrl}/invalid-survey-id/mgmt/${userId}`;
    invalidUserUrl = `${baseUrl}/${survey.id}/mgmt/999999`;

    const permissions = await adminSurveyService.getSurveyPermissions(survey.id);
    const ids = permissions.map(({ id }) => id);

    const nonSurveyPermissions = await Permission.findAll({ where: { id: { [Op.notIn]: ids } } });
    nonSurveyPermissionIds = nonSurveyPermissions.map(({ id }) => id);

    input = {
      permissions: ids,
    };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('patch', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|mgmt');

    const { status } = await request(suite.app)
      .patch(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-mgmt' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .patch(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-mgmt' permission (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(survey.id));

    const { status } = await request(suite.app)
      .patch(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await suite.util.setPermission(['surveys|mgmt', surveyStaff(survey.id)]);

    const { status } = await request(suite.app)
      .patch(invalidSurveyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.util.setPermission(['surveys|mgmt', 'surveyadmin']);

    await suite.sharedTests.assertMissingRecord('get', invalidSurveyUrl);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys|mgmt', 'surveyadmin']);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('patch', url, ['permissions']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .patch(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ permissions: ['invalid permission'] });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['permissions']);
    });

    it('should return 422 for incorrect permissions', async () => {
      const invalidPermissionIdx = faker.datatype.number({
        min: 0,
        max: nonSurveyPermissionIds.length,
      });

      const { status, body } = await request(suite.app)
        .patch(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ permissions: [nonSurveyPermissionIds[invalidPermissionIdx]] });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['permissions']);
    });

    it(`should return 404 when user record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('patch', invalidUserUrl, input);
    });

    it('should return 200 and empty response body', async () => {
      const { status, body } = await request(suite.app)
        .patch(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(200);
      expect(body).toBeEmpty();
    });
  });
};
