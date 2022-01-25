/* eslint-disable max-classes-per-file */
import { Sentiment } from '@intake24/common/feedback';
import { FiveADayFeedback } from '@intake24/common/types/http';
import DemographicRange from '@intake24/survey/feedback/demographic-range';
import { CharacterCardParameters } from '../../feedback/character';

export class FiveADayCardParameters {
  readonly cardType = 'five-a-day';

  readonly portions: number;

  readonly feedback: FiveADayFeedback;

  constructor(portions: number, feedback: FiveADayFeedback) {
    this.feedback = feedback;
    this.portions = portions;
  }
}

export class PlayingCardDetails {
  readonly title: string;

  readonly consumption: number;

  readonly description: string;

  readonly targetConsumption: DemographicRange;

  readonly units: string;

  readonly unitDescription: string;

  readonly sentiment: Sentiment;

  readonly textClass: string;

  readonly iconClass: string;

  readonly warning?: string;

  constructor(
    title: string,
    consumption: number,
    description: string,
    targetConsumption: DemographicRange,
    units: string,
    unitDescription: string,
    sentiment: Sentiment,
    warning?: string
  ) {
    this.title = title;
    this.consumption = Math.round(consumption * 10) / 10;
    this.description = description;
    this.targetConsumption = new DemographicRange(
      Math.round(targetConsumption.start * 10) / 10,
      Math.round(targetConsumption.end * 10) / 10
    );
    this.units = units;
    this.unitDescription = unitDescription;
    this.sentiment = sentiment;
    this.textClass = PlayingCardDetails.getTextClass(sentiment);
    this.iconClass = PlayingCardDetails.getIconClass(sentiment);
    this.warning = warning;
  }

  private static getTextClass(sentiment: Sentiment): string {
    if ([Sentiment.TOO_LOW, Sentiment.LOW, Sentiment.HIGH, Sentiment.TOO_HIGH].includes(sentiment))
      return 'text-danger';

    if ([Sentiment.BIT_LOW, Sentiment.BIT_HIGH].includes(sentiment)) return 'text-warning';

    return 'text-success';
  }

  private static getIconClass(sentiment: Sentiment): string {
    const icons: Record<Sentiment, string> = {
      [Sentiment.TOO_LOW]: 'fa-angle-double-down',
      [Sentiment.LOW]: 'fa-angle-double-down',
      [Sentiment.BIT_LOW]: 'fa-angle-down',
      [Sentiment.GOOD]: 'fa-crosshairs',
      [Sentiment.EXCELLENT]: 'fa-crosshairs',
      [Sentiment.BIT_HIGH]: 'fa-angle-up',
      [Sentiment.HIGH]: 'fa-angle-double-up',
      [Sentiment.TOO_HIGH]: 'fa-angle-double-up',
    };

    return icons[sentiment];
  }
}

export class FoodGroupCardParameters {
  readonly cardType = 'food-group';

  readonly foodGroupName: string;

  readonly intake: number;

  readonly backgroundClass: string;

  readonly details: PlayingCardDetails;

  constructor(
    foodGroupName: string,
    intake: number,
    backgroundClass: string,
    details: PlayingCardDetails
  ) {
    this.foodGroupName = foodGroupName;
    this.intake = intake;
    this.backgroundClass = backgroundClass;
    this.details = details;
  }
}

export type FeedbackCardParameters =
  | CharacterCardParameters
  | FiveADayCardParameters
  | FoodGroupCardParameters;
