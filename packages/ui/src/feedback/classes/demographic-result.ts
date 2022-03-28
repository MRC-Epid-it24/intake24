import DemographicGroup from './demographic-group';

export default class DemographicResult {
  readonly resultedDemographicGroup: DemographicGroup;

  readonly targetDemographicGroup: DemographicGroup;

  readonly consumption: number;

  constructor(
    demographicGroup: DemographicGroup,
    targetDemographicGroup: DemographicGroup,
    consumption: number
  ) {
    this.resultedDemographicGroup = demographicGroup.clone();
    this.targetDemographicGroup = targetDemographicGroup;
    this.consumption = consumption;
  }

  clone(): DemographicResult {
    return new DemographicResult(
      this.resultedDemographicGroup,
      this.targetDemographicGroup,
      this.consumption
    );
  }
}
