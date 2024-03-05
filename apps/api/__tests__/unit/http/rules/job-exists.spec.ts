import { isValidJob, jobTypes } from '@intake24/common/types';

describe('jobExists rule', () => {
  it('should return true for valid job', () => {
    expect(isValidJob(jobTypes[0])).toBeTrue();
  });

  it('should return true for valid job', () => {
    expect(isValidJob('InvalidJob')).toBeFalse();
  });
});
