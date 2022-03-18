import { suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/survey-scheme-questions/refs';

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 200 and refs', async () => {
    await setPermission('survey-scheme-questions|create');

    await suite.sharedTests.assertReferencesResult('get', url, [
      'languages',
      'schemes',
      'questionIds',
    ]);
  });
};
