import userService from '@intake24/survey/services/user.service';
import { FeedbackData, UserPhysicalDataResponse } from '@intake24/common/types/http';
import http from './http.service';
import {
  CharacterRules,
  characterBuilders,
  DemographicGroup,
  FoodGroupFeedback,
  HenryCoefficientsCalculator,
  SurveyStats,
} from '../feedback';

export type FeedbackDictionaries = {
  feedbackData: FeedbackData;
  bmrCalc: HenryCoefficientsCalculator;
  characterRules: CharacterRules[];
  demographicGroups: DemographicGroup[];
  foodGroupFeedback: FoodGroupFeedback[];
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

  const getFeedbackResults = async (surveyId: string): Promise<FeedbackDictionaries> => {
    const [feedbackData, submissions, physicalData] = await Promise.all([
      getFeedbackData(),
      userService.submissions(surveyId),
      userService.fetchPhysicalData(),
    ]);

    const surveyStats = SurveyStats.fromJson(submissions);

    const demographicGroups = feedbackData.demographicGroups.map((item) => {
      const group = DemographicGroup.fromJson(item);
      const nutrientType = feedbackData.nutrientTypes.find((nt) => nt.id === group.nutrientTypeId);

      if (!nutrientType) {
        console.warn(`NutrientID: ${group.nutrientTypeId} for demographic group not found.`);
        return group;
      }

      return group.addNutrient(nutrientType);
    });

    const foodGroupFeedback = FoodGroupFeedback.fromJson(feedbackData.foodGroups);

    const characterRules = characterBuilders.map((characterBuilder) => {
      const { nutrientTypeIds } = characterBuilder;
      const groups = demographicGroups.filter(
        (group) => nutrientTypeIds.indexOf(group.nutrientTypeId) > -1
      );
      return new CharacterRules(
        nutrientTypeIds,
        groups,
        characterBuilder.type,
        characterBuilder.sentiments,
        characterBuilder.displayInFeedbackStyle
      );
    });

    const bmrCalc = HenryCoefficientsCalculator.fromJson(feedbackData.henryCoefficients);

    return {
      feedbackData,
      bmrCalc,
      characterRules,
      demographicGroups,
      foodGroupFeedback,
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
