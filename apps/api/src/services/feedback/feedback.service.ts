import { NotFoundError } from '@intake24/api/http/errors';
import {
  FoodsNutrientType,
  FoodsNutrientUnit,
  NutrientTypeInKcal,
  PhysicalActivityLevel,
  UserSurveyAlias,
} from '@intake24/db';
import type { NutrientType } from '@intake24/common/types/http/feedback';
import { WeightTargetCoefficient, weightTargetsData } from '@intake24/common/feedback';
import type { PhysicalActivityLevelAttributes } from '@intake24/common/types/models';
import type { IoC } from '@intake24/api/ioc';
import { getSurveyUrl } from '@intake24/api/util';
import FeedbackPdfGenerator from './feedback-pdf-generator';

const feedbackService = ({ appConfig }: Pick<IoC, 'appConfig'>) => {
  const getNutrientTypes = async (): Promise<NutrientType[]> => {
    const nutrients = await FoodsNutrientType.findAll({
      include: [{ model: FoodsNutrientUnit }, { model: NutrientTypeInKcal }],
      order: [['id', 'ASC']],
    });

    return nutrients.map((nutrient) => {
      const { id, description, unit, inKcal } = nutrient;
      if (!unit) throw new NotFoundError();

      return { id, description, unit: unit.symbol, kcalPerUnit: inKcal?.kcalPerUnit ?? null };
    });
  };

  const getPhysicalActivityLevels = async (): Promise<PhysicalActivityLevelAttributes[]> =>
    PhysicalActivityLevel.findAll({ order: [['id', 'ASC']] });

  const getWeightTargets = async (): Promise<WeightTargetCoefficient[]> => weightTargetsData;

  const downloadFeedback = async (surveyId: string, userId: string) => {
    const alias = await UserSurveyAlias.findOne({ where: { surveyId, userId } });
    if (!alias) throw new NotFoundError();

    const { urlAuthToken } = alias;
    const { base, survey } = appConfig.urls;
    const baseUrl = getSurveyUrl(base, survey);
    const url = `${baseUrl}/${surveyId}/feedback?token=${urlAuthToken}`;

    const pdfGenerator = new FeedbackPdfGenerator(url);
    return pdfGenerator.getPdfStream();
  };

  return {
    getNutrientTypes,
    getPhysicalActivityLevels,
    getWeightTargets,
    downloadFeedback,
  };
};

export default feedbackService;

export type FeedbackService = ReturnType<typeof feedbackService>;
