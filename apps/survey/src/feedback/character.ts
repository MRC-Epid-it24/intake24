/* eslint-disable no-useless-constructor */
/* eslint-disable max-classes-per-file */
import { FeedbackStyle, Sentiment } from '@intake24/common/feedback';
import DemographicGroup from './demographic-group';
import DemographicResult from './demographic-result';
import DemographicScaleSector from './demographic-scale-sector';
import AggregateFoodStats from './aggregate-food-stats';
import UserDemographic from './user-demographic';

export enum CharacterTypeEnum {
  BATTERY = 'battery',
  BREAD = 'bread',
  CANDY = 'candy',
  SALMON = 'salmon',
  SAUSAGE = 'sausage',
  EGG = 'egg',
  APPLE = 'apple',
  STRAWBERRY = 'strawberry',
  BURGER = 'burger',
  FRIES = 'fries',
  MILK = 'milk',
  IRON = 'iron',
  FOLATE = 'folate',
  CO2 = 'co2',
}

export enum CharacterSentimentEnum {
  DANGER = 'danger',
  WARNING = 'sad',
  HAPPY = 'happy',
  EXCITING = 'exciting',
}

export enum NutrientTypeIdEnum {
  Energy = '1',
  Carbohydrate = '13',
  Protein = '11',
  TotalFat = '49',
  Sugar = '23',
  SatdFat = '50',
  Fibre = '15',
  VitaminA = '120',
  Calcium = '140',
  VitaminC = '129',
  Iron = '143',
  Folate = '134',
  CO2 = '228',
  TotalFreeSugars = '251',
  AOACFibre = '242',
}

export class CharacterSentiment {
  constructor(
    readonly sentiment: Sentiment[],
    readonly sentimentType: CharacterSentimentEnum,
    readonly title: string
  ) {}

  clone(): CharacterSentiment {
    return new CharacterSentiment(this.sentiment, this.sentimentType, this.title);
  }
}

export class CharacterCardParameters {
  readonly cardType = 'character';

  constructor(
    readonly characterType: CharacterTypeEnum,
    readonly characterSentiment: CharacterSentiment,
    readonly demographicResults: DemographicResult[]
  ) {}
}

export class CharacterRules {
  constructor(
    readonly nutrientTypeIds: string[],
    readonly demographicGroups: ReadonlyArray<DemographicGroup>,
    readonly type: CharacterTypeEnum,
    readonly sentiments: CharacterSentiment[],
    readonly displayInFeedbackStyle?: FeedbackStyle
  ) {}

  getSentiment(
    userDemographic: UserDemographic,
    foods: AggregateFoodStats[]
  ): CharacterCardParameters | null {
    const demographicGroups = this.getDemographicsGroups(userDemographic, foods);

    const scaleSectors = demographicGroups
      .map((dg) => {
        return dg.resultedDemographicGroup.scaleSectors;
      })
      .reduce((a, b) => a.slice().concat(b), []);

    const sentiment = this.pickAverageSentiment(scaleSectors);

    return sentiment ? new CharacterCardParameters(this.type, sentiment, demographicGroups) : null;
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
      .filter((dg) => dg.resultedDemographicGroup.scaleSectors.length !== 0);
  }

  private pickAverageSentiment(scaleSectors: DemographicScaleSector[]): CharacterSentiment | null {
    if (!scaleSectors.length) return null;

    const dgSenEnums = scaleSectors.map((ss) => ss.sentiment);
    const enums = [
      Sentiment.TOO_LOW,
      Sentiment.LOW,
      Sentiment.BIT_LOW,
      Sentiment.GOOD,
      Sentiment.EXCELLENT,
      Sentiment.BIT_HIGH,
      Sentiment.HIGH,
      Sentiment.TOO_HIGH,
    ];
    const presentEnums = enums.filter((en) => dgSenEnums.indexOf(en) > -1);
    const averageEnumIndex = Math.round(
      presentEnums.map((e) => enums.indexOf(e)).reduce((a, b) => a + b) / presentEnums.length
    );

    if (!presentEnums.length) return null;

    return this.getCharacterSentimentByDemographicSentiment(enums[averageEnumIndex]);
  }

  private getCharacterSentimentByDemographicSentiment(
    dSentiment: Sentiment
  ): CharacterSentiment | null {
    const sentiments = this.sentiments.filter((s) => s.sentiment.indexOf(dSentiment) > -1);
    return sentiments.length ? sentiments[0] : null;
  }
}

export class CharacterBuilder {
  constructor(
    readonly type: CharacterTypeEnum,
    readonly nutrientTypeIds: string[],
    readonly sentiments: CharacterSentiment[],
    readonly displayInFeedbackStyle?: FeedbackStyle
  ) {}
}

export const characterBuilders = [
  new CharacterBuilder(
    CharacterTypeEnum.BATTERY,
    [NutrientTypeIdEnum.Energy],
    [
      new CharacterSentiment(
        [Sentiment.TOO_LOW, Sentiment.LOW],
        CharacterSentimentEnum.DANGER,
        'Your battery needs a boost'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_LOW],
        CharacterSentimentEnum.WARNING,
        'Your battery needs a boost'
      ),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        "Your're so energetic"
      ),
      new CharacterSentiment(
        [Sentiment.BIT_HIGH],
        CharacterSentimentEnum.WARNING,
        'Energy overload'
      ),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        'Energy overload'
      ),
    ]
  ),

  new CharacterBuilder(
    CharacterTypeEnum.BREAD,
    [NutrientTypeIdEnum.Carbohydrate],
    [
      new CharacterSentiment(
        [Sentiment.TOO_LOW, Sentiment.LOW],
        CharacterSentimentEnum.DANGER,
        'You could be more starchy'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_LOW],
        CharacterSentimentEnum.WARNING,
        'You could be more starchy'
      ),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        "You're Super Starchy!"
      ),
      new CharacterSentiment(
        [Sentiment.BIT_HIGH],
        CharacterSentimentEnum.WARNING,
        'Careful on the starch'
      ),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        'Careful on the starch'
      ),
    ]
  ),

  new CharacterBuilder(
    CharacterTypeEnum.APPLE,
    [NutrientTypeIdEnum.Fibre],
    [
      new CharacterSentiment(
        [Sentiment.TOO_LOW, Sentiment.LOW],
        CharacterSentimentEnum.DANGER,
        'Keep your finger on pulses!'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_LOW],
        CharacterSentimentEnum.WARNING,
        'Keep your finger on pulses!'
      ),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        'Fibre-licious!'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_HIGH],
        CharacterSentimentEnum.WARNING,
        'Keep your finger on pulses!'
      ),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        'Keep your finger on pulses!'
      ),
    ]
  ),

  new CharacterBuilder(
    CharacterTypeEnum.CANDY,
    [NutrientTypeIdEnum.Sugar],
    [
      new CharacterSentiment(
        [Sentiment.TOO_LOW, Sentiment.LOW],
        CharacterSentimentEnum.DANGER,
        'Take care, Sugar'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_LOW],
        CharacterSentimentEnum.WARNING,
        'Take care, Sugar'
      ),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        "You're doing well, Sugar"
      ),
      new CharacterSentiment(
        [Sentiment.BIT_HIGH],
        CharacterSentimentEnum.WARNING,
        'Take care, Sugar'
      ),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        'Take care, Sugar'
      ),
    ]
  ),

  new CharacterBuilder(
    CharacterTypeEnum.SALMON,
    [NutrientTypeIdEnum.VitaminA],
    [
      new CharacterSentiment(
        [Sentiment.TOO_LOW, Sentiment.LOW],
        CharacterSentimentEnum.DANGER,
        'Not quite scoring A* for Vitamin A'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_LOW],
        CharacterSentimentEnum.WARNING,
        'Not quite scoring A* for Vitamin A'
      ),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        'Scoring A* for Vitamin A'
      ),
      new CharacterSentiment([Sentiment.BIT_HIGH], CharacterSentimentEnum.WARNING, 'Too fishy'),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        'Too fishy'
      ),
    ]
  ),

  new CharacterBuilder(
    CharacterTypeEnum.MILK,
    [NutrientTypeIdEnum.Calcium],
    [
      new CharacterSentiment(
        [Sentiment.TOO_LOW, Sentiment.LOW],
        CharacterSentimentEnum.DANGER,
        'Your milk could be spoiled'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_LOW],
        CharacterSentimentEnum.WARNING,
        'Your milk could be spoiled'
      ),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        'Say cheese!'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_HIGH],
        CharacterSentimentEnum.WARNING,
        'Your milk could be spoiled'
      ),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        'Your milk could be spoiled'
      ),
    ]
  ),

  new CharacterBuilder(
    CharacterTypeEnum.BURGER,
    [NutrientTypeIdEnum.SatdFat],
    [
      new CharacterSentiment(
        [Sentiment.TOO_LOW, Sentiment.LOW],
        CharacterSentimentEnum.DANGER,
        "Please don't eat me!"
      ),
      new CharacterSentiment(
        [Sentiment.BIT_LOW],
        CharacterSentimentEnum.WARNING,
        "Please don't eat me!"
      ),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        'Such a rate!'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_HIGH],
        CharacterSentimentEnum.WARNING,
        "Please don't eat me!"
      ),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        "Please don't eat me!"
      ),
    ]
  ),

  new CharacterBuilder(
    CharacterTypeEnum.FRIES,
    [NutrientTypeIdEnum.TotalFat],
    [
      new CharacterSentiment(
        [Sentiment.TOO_LOW, Sentiment.LOW],
        CharacterSentimentEnum.DANGER,
        'Chip is feeling fried'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_LOW],
        CharacterSentimentEnum.WARNING,
        'Chip is feeling fried'
      ),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        'Chip is feeling delicious!'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_HIGH],
        CharacterSentimentEnum.WARNING,
        'Chip is feeling fried'
      ),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        'Chip is feeling fried'
      ),
    ]
  ),

  new CharacterBuilder(
    CharacterTypeEnum.EGG,
    [NutrientTypeIdEnum.Protein],
    [
      new CharacterSentiment(
        [Sentiment.TOO_LOW, Sentiment.LOW],
        CharacterSentimentEnum.DANGER,
        'Pump up that protein!'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_LOW],
        CharacterSentimentEnum.WARNING,
        'Pump up that protein!'
      ),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        'Feels Egg-static!'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_HIGH],
        CharacterSentimentEnum.WARNING,
        'Whey too much protein!'
      ),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        'Whey too much protein!'
      ),
    ]
  ),

  new CharacterBuilder(
    CharacterTypeEnum.STRAWBERRY,
    [NutrientTypeIdEnum.VitaminC],
    [
      new CharacterSentiment(
        [Sentiment.TOO_LOW, Sentiment.LOW],
        CharacterSentimentEnum.DANGER,
        'Stranded in the Vitamin Sea'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_LOW],
        CharacterSentimentEnum.WARNING,
        'Stranded in the Vitamin Sea'
      ),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        'Sí Señor(ita)!'
      ),
      new CharacterSentiment(
        [Sentiment.BIT_HIGH],
        CharacterSentimentEnum.WARNING,
        'Too deep in the Vitamin Sea'
      ),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        'Too deep in the Vitamin Sea'
      ),
    ]
  ),

  new CharacterBuilder(
    CharacterTypeEnum.IRON,
    [NutrientTypeIdEnum.Iron],
    [
      new CharacterSentiment([Sentiment.TOO_LOW, Sentiment.LOW], CharacterSentimentEnum.DANGER, ''),
      new CharacterSentiment([Sentiment.BIT_LOW], CharacterSentimentEnum.WARNING, ''),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        ''
      ),
      new CharacterSentiment([Sentiment.BIT_HIGH], CharacterSentimentEnum.WARNING, ''),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        ''
      ),
    ],
    'default'
  ),

  new CharacterBuilder(
    CharacterTypeEnum.FOLATE,
    [NutrientTypeIdEnum.Folate],
    [
      new CharacterSentiment([Sentiment.TOO_LOW, Sentiment.LOW], CharacterSentimentEnum.DANGER, ''),
      new CharacterSentiment([Sentiment.BIT_LOW], CharacterSentimentEnum.WARNING, ''),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        ''
      ),
      new CharacterSentiment([Sentiment.BIT_HIGH], CharacterSentimentEnum.WARNING, ''),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        ''
      ),
    ],
    'default'
  ),

  new CharacterBuilder(
    CharacterTypeEnum.CANDY,
    [NutrientTypeIdEnum.TotalFreeSugars],
    [
      new CharacterSentiment([Sentiment.TOO_LOW, Sentiment.LOW], CharacterSentimentEnum.DANGER, ''),
      new CharacterSentiment([Sentiment.BIT_LOW], CharacterSentimentEnum.WARNING, ''),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        ''
      ),
      new CharacterSentiment([Sentiment.BIT_HIGH], CharacterSentimentEnum.WARNING, ''),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        ''
      ),
    ],
    'default'
  ),

  new CharacterBuilder(
    CharacterTypeEnum.APPLE,
    [NutrientTypeIdEnum.AOACFibre],
    [
      new CharacterSentiment([Sentiment.TOO_LOW, Sentiment.LOW], CharacterSentimentEnum.DANGER, ''),
      new CharacterSentiment([Sentiment.BIT_LOW], CharacterSentimentEnum.WARNING, ''),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        ''
      ),
      new CharacterSentiment([Sentiment.BIT_HIGH], CharacterSentimentEnum.WARNING, ''),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        ''
      ),
    ],
    'default'
  ),

  new CharacterBuilder(
    CharacterTypeEnum.CO2,
    [NutrientTypeIdEnum.CO2],
    [
      new CharacterSentiment([Sentiment.TOO_LOW, Sentiment.LOW], CharacterSentimentEnum.DANGER, ''),
      new CharacterSentiment([Sentiment.BIT_LOW], CharacterSentimentEnum.WARNING, ''),
      new CharacterSentiment(
        [Sentiment.GOOD, Sentiment.EXCELLENT],
        CharacterSentimentEnum.EXCITING,
        ''
      ),
      new CharacterSentiment([Sentiment.BIT_HIGH], CharacterSentimentEnum.WARNING, ''),
      new CharacterSentiment(
        [Sentiment.HIGH, Sentiment.TOO_HIGH],
        CharacterSentimentEnum.DANGER,
        ''
      ),
    ],
    'default'
  ),
];
