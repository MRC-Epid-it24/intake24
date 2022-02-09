import { DemographicGroupScaleSector, Sentiment } from '@intake24/common/feedback';
import { LocaleTranslation, RequiredLocaleTranslation } from '@intake24/common/types';
import DemographicRange from './demographic-range';

export default class DemographicScaleSector {
  readonly name: RequiredLocaleTranslation;

  readonly description: LocaleTranslation;

  readonly sentiment: Sentiment;

  readonly range: DemographicRange;

  constructor(
    name: RequiredLocaleTranslation,
    description: LocaleTranslation,
    range: DemographicRange,
    sentiment: Sentiment
  ) {
    this.name = name;
    this.description = description;
    this.range = range;
    this.sentiment = sentiment;
  }

  static fromJson(sector: DemographicGroupScaleSector): DemographicScaleSector {
    return new DemographicScaleSector(
      sector.name,
      sector.description,
      DemographicRange.fromJson(sector.range.start, sector.range.end) as DemographicRange,
      sector.sentiment
    );
  }

  clone(): DemographicScaleSector {
    return new DemographicScaleSector(this.name, this.description, this.range, this.sentiment);
  }
}
