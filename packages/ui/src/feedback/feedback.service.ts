import type {
  Card,
  DemographicGroup as FeedbackSchemeDemographicGroup,
  HenryCoefficient,
} from '@intake24/common/feedback';
import type {
  FeedbackDataResponse,
  SurveySubmissionEntry,
  UserPhysicalDataResponse,
} from '@intake24/common/types/http';

import type { HttpClient } from '../types/http';
import type { CardWithDemGroups } from './cards-builder';
import { CharacterRules, DemographicGroup, SurveyStats, UserDemographic } from './classes';

export type FeedbackDictionaries = {
  feedbackData: FeedbackDataResponse;
  cards: CardWithDemGroups[];
  demographicGroups: DemographicGroup[];
  surveyStats: SurveyStats;
};

export type FeedbackResults = {
  feedbackDicts: FeedbackDictionaries;
  userDemographic: UserDemographic;
};

export type UserPhysicalData = NonNullable<UserPhysicalDataResponse>;

const createFeedbackService = (httpClient: HttpClient) => {
  let cachedFeedbackData: FeedbackDataResponse | null = null;

  const fetchFeedbackData = async (): Promise<FeedbackDataResponse> => {
    const { data } = await httpClient.get<FeedbackDataResponse>('feedback');
    return data;
  };

  const getFeedbackData = async (): Promise<FeedbackDataResponse> => {
    if (cachedFeedbackData) return cachedFeedbackData;

    const data = await fetchFeedbackData();
    cachedFeedbackData = data;

    return data;
  };

  const getUserDemographic = (
    feedbackData: FeedbackDataResponse,
    henryCoefficients: HenryCoefficient[],
    physicalData: UserPhysicalData
  ): UserDemographic => {
    const { physicalActivityLevels, weightTargets } = feedbackData;

    const physicalActivityLevel = physicalActivityLevels.find(
      ({ id }) => id === physicalData.physicalActivityLevelId
    );
    const weightTarget = weightTargets.find(({ id }) => id === physicalData.weightTarget);

    return new UserDemographic(
      physicalData,
      henryCoefficients,
      physicalActivityLevel,
      weightTarget
    );
  };

  const getFeedbackResults = async (ops: {
    cards: Card[];
    groups: FeedbackSchemeDemographicGroup[];
    henryCoefficients: HenryCoefficient[];
    physicalData: UserPhysicalData;
    submissions: SurveySubmissionEntry[];
  }): Promise<FeedbackResults> => {
    const { cards, groups, henryCoefficients, physicalData, submissions } = ops;

    const feedbackData = await getFeedbackData();

    const surveyStats = SurveyStats.fromJson(submissions);

    const demographicGroups = groups.reduce<DemographicGroup[]>((acc, item) => {
      const nutrientType = feedbackData.nutrientTypes.find((nt) => nt.id === item.nutrientTypeId);

      const group = DemographicGroup.fromJson(item, nutrientType);
      acc.push(group);

      return acc;
    }, []);

    const cardWithDemGroups: CardWithDemGroups[] = cards.map((card) => {
      if (card.type !== 'character')
        return {
          ...card,
          demographicGroups: demographicGroups.filter((group) => group.type === card.type),
        };

      const { nutrientTypeIds } = card;
      const demGroups = demographicGroups.filter(
        (group) =>
          group.type === card.type && group.nutrient && nutrientTypeIds.includes(group.nutrient.id)
      );

      return new CharacterRules(card, demGroups);
    });

    const feedbackDicts = {
      feedbackData,
      cards: cardWithDemGroups,
      demographicGroups,
      surveyStats,
    };

    const userDemographic = getUserDemographic(feedbackData, henryCoefficients, physicalData);

    return {
      feedbackDicts,
      userDemographic,
    };
  };

  return {
    fetchFeedbackData,
    getFeedbackData,
    getUserDemographic,
    getFeedbackResults,
  };
};

export default createFeedbackService;

export type FeedbackService = ReturnType<typeof createFeedbackService>;
