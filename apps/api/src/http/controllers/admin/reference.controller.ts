import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  AsServedSetsResponse,
  DrinkwareSetsResponse,
  FeedbackSchemeReferences,
  GuideImagesResponse,
  ImageMapsResponse,
  LanguageReferences,
  NutrientTableReferences,
  SurveyReferences,
  SurveySchemeReferences,
  SurveySchemesResponse,
  SystemLocaleReferences,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import imagesResponseCollection from '@intake24/api/http/responses/admin/images';
import {
  AsServedSet,
  DrinkwareSet,
  FeedbackScheme,
  GuideImage,
  ImageMap,
  Language,
  NutrientTable,
  StandardUnit,
  Survey,
  SurveyScheme,
  SystemLocale,
} from '@intake24/db';

const referenceController = ({ imagesBaseUrl }: Pick<IoC, 'imagesBaseUrl'>) => {
  const responseCollection = imagesResponseCollection(imagesBaseUrl);

  const asServedSets = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<AsServedSetsResponse>
  ): Promise<void> => {
    const asServedSets = await AsServedSet.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: ['selectionImage'],
      transform: responseCollection.asServedSetListResponse,
    });

    res.json(asServedSets);
  };

  const drinkwareSets = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<DrinkwareSetsResponse>
  ): Promise<void> => {
    const tasks = await DrinkwareSet.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: [{ association: 'imageMap', include: [{ association: 'baseImage' }] }],
      transform: responseCollection.drinkwareListResponse,
    });

    res.json(tasks);
  };

  const guideImages = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<GuideImagesResponse>
  ): Promise<void> => {
    const guideImages = await GuideImage.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: ['selectionImage'],
      transform: responseCollection.guideListResponse,
    });

    res.json(guideImages);
  };

  const imageMaps = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<ImageMapsResponse>
  ): Promise<void> => {
    const images = await ImageMap.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: ['baseImage'],
      transform: responseCollection.mapListResponse,
    });

    res.json(images);
  };

  const languages = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<LanguageReferences>
  ): Promise<void> => {
    const languages = await Language.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'code', 'englishName', 'localName'],
      columns: ['id', 'englishName', 'localName'],
      order: [['id', 'ASC']],
    });

    res.json(languages);
  };

  const locales = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SystemLocaleReferences>
  ): Promise<void> => {
    const locales = await SystemLocale.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'code', 'englishName', 'localName'],
      columns: ['code', 'englishName', 'localName'],
      order: [['code', 'ASC']],
    });

    res.json(locales);
  };

  const nutrientTables = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<NutrientTableReferences>
  ): Promise<void> => {
    const nutrientTables = await NutrientTable.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'description'],
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
    });

    res.json(nutrientTables);
  };

  const feedbackSchemes = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<FeedbackSchemeReferences>
  ): Promise<void> => {
    const feedbackSchemes = await FeedbackScheme.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name'],
      order: [['name', 'ASC']],
    });
    res.json(feedbackSchemes);
  };

  const standardUnits = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveySchemesResponse>
  ): Promise<void> => {
    const standardUnits = await StandardUnit.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'estimateIn', 'howMany'],
      columns: ['id'],
      order: [['id', 'ASC']],
    });
    res.json(standardUnits);
  };

  const surveys = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveyReferences>
  ): Promise<void> => {
    const surveys = await Survey.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'slug', 'name'],
      columns: ['name'],
      order: [['name', 'ASC']],
    });
    res.json(surveys);
  };

  const surveySchemes = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveySchemeReferences>
  ): Promise<void> => {
    const surveySchemes = await SurveyScheme.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name'],
      order: [['name', 'ASC']],
    });
    res.json(surveySchemes);
  };

  return {
    asServedSets,
    drinkwareSets,
    guideImages,
    imageMaps,
    languages,
    locales,
    nutrientTables,
    feedbackSchemes,
    standardUnits,
    surveys,
    surveySchemes,
  };
};

export default referenceController;

export type ReferenceController = ReturnType<typeof referenceController>;
