import { Sentiment } from '@intake24/common/feedback';
import { DemographicGroupScaleSectorAttributes } from '@intake24/common/types/models';
import DemographicRange from './demographic-range';

export default class DemographicScaleSector {
  readonly id: string;

  readonly name: string;

  readonly description: string | null;

  readonly sentiment: Sentiment;

  readonly range: DemographicRange;

  constructor(
    id: string,
    name: string,
    description: string | null,
    sentiment: Sentiment,
    range: DemographicRange
  ) {
    this.id = id;
    this.name = name;
    this.sentiment = sentiment;
    this.range = range;
    this.description = description;
  }

  static fromJson(sector: DemographicGroupScaleSectorAttributes): DemographicScaleSector {
    return new DemographicScaleSector(
      sector.id,
      sector.name,
      sector.description,
      sector.sentiment,
      DemographicRange.fromJson(sector.minRange, sector.maxRange) as DemographicRange
    );
  }

  clone(): DemographicScaleSector {
    return new DemographicScaleSector(
      this.id,
      this.name,
      this.description,
      this.sentiment,
      this.range
    );
  }
}
