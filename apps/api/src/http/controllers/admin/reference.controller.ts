import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  AsServedSetsResponse,
  CategoryReferences,
  DrinkwareSetsResponse,
  FeedbackSchemeReferences,
  FoodReferences,
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
  Category,
  DrinkwareSet,
  FeedbackScheme,
  Food,
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

  const categories = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<CategoryReferences>
  ): Promise<void> => {
    const categories = await Category.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['code', 'name'],
      columns: ['code', 'name'],
      order: [['code', 'ASC']],
    });

    res.json(categories);
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

  const foods = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<FoodReferences>
  ): Promise<void> => {
    const foods = await Food.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['code', 'name'],
      columns: ['code', 'name'],
      order: [['code', 'ASC']],
    });

    res.json(foods);
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

  const standardUnits = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveySchemesResponse>
  ): Promise<void> => {
    const standardUnits = await StandardUnit.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'name', 'estimateIn', 'howMany'],
      columns: ['id', 'name'],
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
    categories,
    drinkwareSets,
    feedbackSchemes,
    foods,
    guideImages,
    imageMaps,
    languages,
    locales,
    nutrientTables,
    standardUnits,
    surveys,
    surveySchemes,
  };
};

export default referenceController;

export type ReferenceController = ReturnType<typeof referenceController>;
