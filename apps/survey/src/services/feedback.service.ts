import userService from '@intake24/survey/services/user.service';
import { FeedbackData, UserPhysicalDataResponse } from '@intake24/common/types/http';
import {
  Card,
  DemographicGroup as FeedbackSchemeDemographicGroup,
} from '@intake24/common/feedback';
import http from './http.service';
import { CardWithCharRules, CharacterRules, DemographicGroup, SurveyStats } from '../feedback';

export type FeedbackDictionaries = {
  feedbackData: FeedbackData;
  cards: CardWithCharRules[];
  demographicGroups: DemographicGroup[];
  physicalData: UserPhysicalDataResponse;
  surveyStats: SurveyStats;
};

const feedbackService = () => {
  let cachedFeedbackData: FeedbackData | null = null;

  const fetchFeedbackData = async (): Promise<FeedbackData> => {
    const { data } = await http.get<FeedbackData>('feedback');
    return data;
  };

  const getFeedbackData = async (): Promise<FeedbackData> => {
    if (cachedFeedbackData) return cachedFeedbackData;

    const data = await fetchFeedbackData();
    cachedFeedbackData = data;

    return data;
  };

  const getFeedbackResults = async (
    surveyId: string,
    cards: Card[],
    groups: FeedbackSchemeDemographicGroup[]
  ): Promise<FeedbackDictionaries> => {
    const [feedbackData, submissions, physicalData] = await Promise.all([
      getFeedbackData(),
      userService.submissions(surveyId),
      userService.fetchPhysicalData(),
    ]);

    const surveyStats = SurveyStats.fromJson(submissions);

    const demographicGroups = groups.reduce<DemographicGroup[]>((acc, item) => {
      const nutrientType = feedbackData.nutrientTypes.find((nt) => nt.id === item.nutrientTypeId);

      if (nutrientType) {
        const group = DemographicGroup.fromJson(item, nutrientType);
        acc.push(group);
      } else console.warn(`NutrientID: ${item.nutrientTypeId} for demographic group not found.`);

      return acc;
    }, []);

    const cardsWithCharacterRules = cards.map((card) => {
      if (card.type !== 'character') return card;

      const { nutrientTypeIds } = card;
      const demGroups = demographicGroups.filter((group) =>
        nutrientTypeIds.includes(group.nutrient.id)
      );

      return new CharacterRules(card, demGroups);
    });

    return {
      feedbackData,
      cards: cardsWithCharacterRules,
      demographicGroups,
      physicalData,
      surveyStats,
    };
  };

  return {
    fetchFeedbackData,
    getFeedbackData,
    getFeedbackResults,
  };
};

export default feedbackService();
