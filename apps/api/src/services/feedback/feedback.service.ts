import { resolve } from 'node:path';
import { URLSearchParams } from 'node:url';

import type { IoC } from '@intake24/api/ioc';
import type { WeightTargetCoefficient } from '@intake24/common/feedback';
import type { NutrientType } from '@intake24/common/types/http/feedback';
import type { PhysicalActivityLevelAttributes } from '@intake24/common/types/models';
import { NotFoundError } from '@intake24/api/http/errors';
import { getFrontEndUrl } from '@intake24/api/util';
import { weightTargetsData } from '@intake24/common/feedback';
import { FoodsNutrientType, PhysicalActivityLevel, UserSurveyAlias } from '@intake24/db';

import FeedbackPdfGenerator from './feedback-pdf-generator';

const feedbackService = ({ appConfig, fsConfig }: Pick<IoC, 'appConfig' | 'fsConfig'>) => {
  const getNutrientTypes = async (): Promise<NutrientType[]> => {
    const nutrients = await FoodsNutrientType.findAll({
      include: [{ association: 'unit' }, { association: 'inKcal' }],
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

  const getFeedbackLinks = async (surveyId: string, userId: string, submissions: string[] = []) => {
    const alias = await UserSurveyAlias.findOne({
      where: { surveyId, userId },
      include: [{ association: 'survey', attributes: ['id', 'slug'] }],
    });
    if (!alias || !alias.survey) throw new NotFoundError();

    const {
      username,
      urlAuthToken,
      survey: { slug },
    } = alias;

    const { base, survey } = appConfig.urls;
    const baseUrl = getFrontEndUrl(base, survey);
    const query = new URLSearchParams([
      ['token', urlAuthToken],
      ...submissions.map<[string, string]>((submission) => ['submissions', submission]),
    ]).toString();

    const url = `${baseUrl}/${slug}/feedback?${query}`;
    const filename = `Intake24-${slug}-${username}-${new Date()
      .toISOString()
      .substring(0, 10)}.pdf`;

    return { url, filename };
  };

  const getFeedbackStream = async (
    surveyId: string,
    userId: string,
    submissions: string[] = []
  ) => {
    const { url, filename } = await getFeedbackLinks(surveyId, userId, submissions);

    const pdfStream = await new FeedbackPdfGenerator(url).getPdfStream();

    return { pdfStream, filename, url };
  };

  const getFeedbackFile = async (surveyId: string, userId: string, submissions: string[] = []) => {
    const { url, filename } = await getFeedbackLinks(surveyId, userId, submissions);

    const path = resolve(fsConfig.local.downloads, filename);

    await new FeedbackPdfGenerator(url).getPdfFile(path);

    return { path, filename, url };
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
