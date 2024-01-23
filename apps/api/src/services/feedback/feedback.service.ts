import { resolve } from 'node:path';
import { URL, URLSearchParams } from 'node:url';

import type { Protocol } from 'puppeteer';

import type { IoC } from '@intake24/api/ioc';
import type { WeightTargetCoefficient } from '@intake24/common/feedback';
import type { Subject } from '@intake24/common/security';
import type { NutrientType } from '@intake24/common/types/http/feedback';
import type { PhysicalActivityLevelAttributes } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { btoa, getFrontEndUrl } from '@intake24/api/util';
import { weightTargetsData } from '@intake24/common/feedback';
import { FoodsNutrientType, PhysicalActivityLevel, UserSurveyAlias } from '@intake24/db';

import FeedbackPdfGenerator from './feedback-pdf-generator';

export type CreateRefreshCookie = {
  slug: string;
  username: string;
  userId: string;
};

const feedbackService = ({
  appConfig,
  fsConfig,
  securityConfig,
  jwtService,
}: Pick<IoC, 'appConfig' | 'fsConfig' | 'securityConfig' | 'jwtService'>) => {
  const getNutrientTypes = async (): Promise<NutrientType[]> => {
    const nutrients = await FoodsNutrientType.findAll({
      include: [
        { association: 'unit', attributes: ['symbol'] },
        { association: 'inKcal', attributes: ['kcalPerUnit'] },
      ],
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
      survey: { slug },
    } = alias;

    const { base, survey } = appConfig.urls;
    const baseUrl = getFrontEndUrl(base, survey);
    const query = new URLSearchParams(
      submissions.map<[string, string]>((submission) => ['submissions', submission])
    ).toString();

    const url = `${baseUrl}/${slug}/feedback?${query}`;
    const filename = `Intake24-${slug}-${username}-${new Date()
      .toISOString()
      .substring(0, 10)}.pdf`;

    return { url, filename, slug, username };
  };

  const createRefreshCookie = async (
    options: CreateRefreshCookie
  ): Promise<Protocol.Network.CookieParam> => {
    const { slug, username, userId } = options;
    const { name, httpOnly, path, secure, sameSite } = securityConfig.jwt.survey.cookie;
    const subject: Subject = { provider: 'surveyAlias', providerKey: `${slug}#${username}` };
    const domain = new URL(appConfig.urls.base).host;

    const refreshToken = await jwtService.issueRefreshToken({ surveyId: slug, userId }, 'survey', {
      subject: btoa(subject),
      expiresIn: '1m',
    });

    return {
      name,
      value: refreshToken,
      domain,
      httpOnly,
      path,
      sameSite: sameSite as Protocol.Network.CookieSameSite,
      secure,
    };
  };

  const getFeedbackStream = async (
    surveyId: string,
    userId: string,
    submissions: string[] = []
  ) => {
    const { url, filename, slug, username } = await getFeedbackLinks(surveyId, userId, submissions);
    const cookie = await createRefreshCookie({ slug, username, userId });

    const pdfStream = await new FeedbackPdfGenerator(url, cookie).getPdfStream();

    return { pdfStream, filename, url };
  };

  const getFeedbackFile = async (surveyId: string, userId: string, submissions: string[] = []) => {
    const { url, filename, slug, username } = await getFeedbackLinks(surveyId, userId, submissions);
    const cookie = await createRefreshCookie({ slug, username, userId });

    const path = resolve(fsConfig.local.downloads, filename);

    await new FeedbackPdfGenerator(url, cookie).getPdfFile(path);

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
