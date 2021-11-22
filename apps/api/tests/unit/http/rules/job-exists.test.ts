import { jobExists } from '@api/http/rules';
import { jobTypes } from '@common/types';

describe('jobExists rule', () => {
  it('should return true for valid job', () => {
    expect(jobExists(jobTypes[0])).toBeTrue();
  });

  it('should return true for valid job', () => {
    expect(jobExists('InvalidJob')).toBeFalse();
  });
});
