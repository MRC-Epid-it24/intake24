import { jobExists } from '@intake24/api/http/rules';
import { jobTypes } from '@intake24/common/types';

describe('jobExists rule', () => {
  it('should return true for valid job', () => {
    expect(jobExists(jobTypes[0])).toBeTrue();
  });

  it('should return true for valid job', () => {
    expect(jobExists('InvalidJob')).toBeFalse();
  });
});
