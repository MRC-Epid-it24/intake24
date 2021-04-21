import { pick } from 'lodash';
import request from 'supertest';
import { suite } from '@tests/integration/helpers';
import { PublicSurveyEntryResponse } from '@common/types/http';

export default (): void => {
  let url: string;
  let invalidUrl: string;

  let output: PublicSurveyEntryResponse;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.survey.id}`;
    invalidUrl = `/api/surveys/invalid-survey`;

    output = pick(suite.data.survey, ['id', 'name', 'localeId', 'originatingUrl', 'supportEmail']);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    const { status } = await request(suite.app).get(invalidUrl).set('Accept', 'application/json');

    expect(status).toBe(404);
  });

  it('should return 200 and public survey record', async () => {
    const { status, body } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(200);
    expect(body).toEqual(output);
  });
};
