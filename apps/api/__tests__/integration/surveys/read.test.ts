import type { PublicSurveyEntry } from '@intake24/common/types/http';
import { publicSurveyEntryResponse } from '@intake24/api/http/responses';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  let url: string;
  let invalidUrl: string;

  let output: PublicSurveyEntry;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.system.survey.slug}`;
    invalidUrl = `/api/surveys/invalid-survey`;

    output = publicSurveyEntryResponse(suite.data.system.survey);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.sharedTests.assertMissingRecord('get', invalidUrl, { bearer: null });
  });

  it('should return 200 and public survey record', async () => {
    await suite.sharedTests.assertRecord('get', url, output, { bearer: null });
  });
};
