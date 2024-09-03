import type { DemographicGroupScaleSector } from '@intake24/common/feedback';

import DemographicRange from './demographic-range';

export default class DemographicScaleSector {
  readonly name: DemographicGroupScaleSector['name'];
  readonly summary: DemographicGroupScaleSector['summary'];
  readonly description: DemographicGroupScaleSector['description'];
  readonly intake: DemographicGroupScaleSector['intake'];
  readonly range: DemographicRange;
  readonly sentiment: DemographicGroupScaleSector['sentiment'];

  constructor(
    name: DemographicGroupScaleSector['name'],
    summary: DemographicGroupScaleSector['summary'],
    description: DemographicGroupScaleSector['description'],
    intake: DemographicGroupScaleSector['intake'],
    range: DemographicRange,
    sentiment: DemographicGroupScaleSector['sentiment'],
  ) {
    this.name = name;
    this.summary = summary;
    this.description = description;
    this.intake = intake;
    this.range = range;
    this.sentiment = sentiment;
  }

  static fromJson(sector: DemographicGroupScaleSector): DemographicScaleSector {
    return new DemographicScaleSector(
      sector.name,
      sector.summary,
      sector.description,
      sector.intake,
      DemographicRange.fromJson(sector.range.start, sector.range.end) as DemographicRange,
      sector.sentiment,
    );
  }

  clone(): DemographicScaleSector {
    return new DemographicScaleSector(
      this.name,
      this.summary,
      this.description,
      this.intake,
      this.range,
      this.sentiment,
    );
  }
}
