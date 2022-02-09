import {
  Character,
  CharacterSentiment,
  CharacterType,
  Sentiment,
  sentiments as defaultSentiments,
} from '@intake24/common/feedback';
import AggregateFoodStats from './aggregate-food-stats';
import DemographicGroup from './demographic-group';
import DemographicResult from './demographic-result';
import DemographicScaleSector from './demographic-scale-sector';
import UserDemographic from './user-demographic';

export type CharacterParameters = {
  readonly type: 'character';
  readonly characterType: CharacterType;
  readonly sentiment: CharacterSentiment;
  readonly results: DemographicResult[];
};

export class CharacterRules implements Character {
  readonly id: string;

  readonly type = 'character' as const;

  readonly characterType: CharacterType;

  readonly nutrientTypeIds: string[];

  readonly sentiments: CharacterSentiment[];

  readonly demographicGroups: DemographicGroup[];

  constructor(
    { id, characterType, nutrientTypeIds, sentiments }: Character,
    demographicGroups: DemographicGroup[]
  ) {
    this.id = id;
    this.characterType = characterType;
    this.nutrientTypeIds = nutrientTypeIds;
    this.sentiments = sentiments;

    this.demographicGroups = demographicGroups;
  }

  getSentiment(
    userDemographic: UserDemographic,
    foods: AggregateFoodStats[]
  ): CharacterParameters | null {
    const results = this.getDemographicsGroups(userDemographic, foods);

    const scaleSectors = results
      .map((dg) => dg.resultedDemographicGroup.scaleSectors)
      .reduce((a, b) => a.slice().concat(b), []);

    const sentiment = this.pickAverageSentiment(scaleSectors);

    return sentiment
      ? { type: 'character', characterType: this.characterType, sentiment, results }
      : null;
  }

  private getDemographicsGroups(
    userDemographic: UserDemographic,
    foods: AggregateFoodStats[]
  ): DemographicResult[] {
    const demographicGroups = this.demographicGroups.filter((dg) =>
      dg.matchesUserDemographic(userDemographic)
    );
    return demographicGroups
      .map((dg) => dg.getResult(userDemographic, foods))
      .filter((dg) => !!dg.resultedDemographicGroup.scaleSectors.length);
  }

  private pickAverageSentiment(scaleSectors: DemographicScaleSector[]): CharacterSentiment | null {
    if (!scaleSectors.length) return null;

    const dgSenEnums = scaleSectors.map((ss) => ss.sentiment);
    const presentEnums = defaultSentiments.filter((en) => dgSenEnums.includes(en));
    const averageEnumIndex = Math.round(
      presentEnums.map((e) => defaultSentiments.indexOf(e)).reduce((a, b) => a + b) /
        presentEnums.length
    );

    if (!presentEnums.length) return null;

    return this.getCharacterSentimentByDemographicSentiment(defaultSentiments[averageEnumIndex]);
  }

  private getCharacterSentimentByDemographicSentiment(
    dSentiment: Sentiment
  ): CharacterSentiment | null {
    const charSentiments = this.sentiments.filter((s) => s.sentiment.includes(dSentiment));
    return charSentiments.length ? charSentiments[0] : null;
  }
}
