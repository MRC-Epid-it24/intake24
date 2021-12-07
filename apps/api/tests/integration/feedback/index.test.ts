import henryCoefficients from './henry-coefficients.test';
import physicalActivityLevels from './physical-activity-levels.test';
import weightTargets from './weight-targets.test';

export default () => {
  describe('GET /api/feedback/henry-coefficients', henryCoefficients);
  describe('GET /api/feedback/physical-activity-levels', physicalActivityLevels);
  describe('GET /api/feedback/weight-targets', weightTargets);
};
