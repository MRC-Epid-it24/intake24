import { resolve } from 'path';
import { NotFoundError } from '@intake24/api/http/errors';
import {
  FoodsNutrientType,
  FoodsNutrientUnit,
  NutrientTypeInKcal,
  PhysicalActivityLevel,
  Survey,
  UserSurveyAlias,
} from '@intake24/db';
import type { NutrientType } from '@intake24/common/types/http/feedback';
import { WeightTargetCoefficient, weightTargetsData } from '@intake24/common/feedback';
import type { PhysicalActivityLevelAttributes } from '@intake24/common/types/models';
import type { IoC } from '@intake24/api/ioc';
import { getFrontEndUrl } from '@intake24/api/util';
import FeedbackPdfGenerator from './feedback-pdf-generator';

const feedbackService = ({ appConfig, fsConfig }: Pick<IoC, 'appConfig' | 'fsConfig'>) => {
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
    PhysicalActivityLevel.findAll({ order: [['id', 'ASC']], raw: true });

  const getWeightTargets = async (): Promise<WeightTargetCoefficient[]> => weightTargetsData;

  const getFeedbackLinks = async (surveyId: string, userId: string) => {
    const alias = await UserSurveyAlias.findOne({
      where: { surveyId, userId },
      include: [{ model: Survey, attributes: ['id', 'slug'] }],
    });
    if (!alias || !alias.survey) throw new NotFoundError();

    const {
      urlAuthToken,
      survey: { slug },
    } = alias;
    const { base, survey } = appConfig.urls;
    const baseUrl = getFrontEndUrl(base, survey);
    const url = `${baseUrl}/${slug}/feedback?token=${urlAuthToken}`;
    const filename = `Intake24-${slug}-${alias.username}-${new Date()
      .toISOString()
      .substring(0, 10)}.pdf`;

    return { url, filename };
  };

  const getFeedbackStream = async (surveyId: string, userId: string) => {
    const { url, filename } = await getFeedbackLinks(surveyId, userId);

    const pdfGenerator = new FeedbackPdfGenerator(url);
    const pdfStream = await pdfGenerator.getPdfStream();

    return { pdfStream, filename };
  };

  const getFeedbackFile = async (surveyId: string, userId: string) => {
    const { url, filename } = await getFeedbackLinks(surveyId, userId);

    const path = resolve(fsConfig.local.downloads, filename);

    const pdfGenerator = new FeedbackPdfGenerator(url);
    await pdfGenerator.getPdfFile(path);

    return { path, filename };
  };

  return {
    getNutrientTypes,
    getPhysicalActivityLevels,
    getWeightTargets,
    getFeedbackStream,
    getFeedbackFile,
  };
};

export default feedbackService;

export type FeedbackService = ReturnType<typeof feedbackService>;
