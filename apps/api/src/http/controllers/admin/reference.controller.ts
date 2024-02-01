import type { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { pick } from 'lodash';
import { col, fn, literal } from 'sequelize';

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
  NutrientTableRecordReferences,
  NutrientTableReferences,
  NutrientTypesResponse,
  SurveyReferences,
  SurveySchemeReferences,
  SurveySchemesResponse,
  SystemLocaleReferences,
} from '@intake24/common/types/http/admin';
import type { PaginateOptions, PaginateQuery } from '@intake24/db';
import imagesResponseCollection from '@intake24/api/http/responses/admin/images';
import {
  AsServedSet,
  Category,
  DrinkwareSet,
  FeedbackScheme,
  Food,
  FoodGroup,
  FoodsNutrientType,
  GuideImage,
  ImageMap,
  Language,
  NutrientTable,
  NutrientTableRecord,
  Op,
  StandardUnit,
  Survey,
  SurveyScheme,
  SystemLocale,
  visibilityScope,
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
      order: [[fn('lower', col('AsServedSet.id')), 'ASC']],
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
      order: [[fn('lower', col('code')), 'ASC']],
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
      order: [[fn('lower', col('DrinkwareSet.id')), 'ASC']],
      include: [{ association: 'imageMap', include: [{ association: 'baseImage' }] }],
      transform: responseCollection.drinkwareListResponse,
    });

    res.json(tasks);
  };

  const feedbackSchemes = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<FeedbackSchemeReferences>
  ): Promise<void> => {
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const paginateOptions: PaginateOptions<FeedbackScheme> = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name'],
      order: [[fn('lower', col('FeedbackScheme.name')), 'ASC']],
    };

    if (await aclService.hasPermission('feedback-schemes|use')) {
      const feedbackSchemes = await FeedbackScheme.paginate(paginateOptions);
      res.json(feedbackSchemes);
      return;
    }

    const feedbackSchemes = await FeedbackScheme.paginate({
      ...paginateOptions,
      ...visibilityScope(userId),
      subQuery: false,
    });

    res.json(feedbackSchemes);
  };

  const foodGroups = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<FoodReferences>
  ): Promise<void> => {
    const foods = await FoodGroup.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'name'],
      columns: ['name'],
      order: [['name', 'ASC']],
    });

    res.json(foods);
  };

  const foods = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<FoodReferences>
  ): Promise<void> => {
    const foods = await Food.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['code', 'name'],
      columns: ['code', 'name'],
      order: [[fn('lower', col('code')), 'ASC']],
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
      order: [[fn('lower', col('GuideImage.id')), 'ASC']],
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
      order: [[fn('lower', col('ImageMap.id')), 'ASC']],
      include: ['baseImage'],
      transform: responseCollection.mapListResponse,
    });

    res.json(images);
  };

  const languages = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<LanguageReferences>
  ): Promise<void> => {
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const paginateOptions: PaginateOptions<Language> = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'code', 'englishName', 'localName'],
      columns: ['code', 'englishName', 'localName'],
      order: [[fn('lower', col('Language.code')), 'ASC']],
    };

    if (await aclService.hasPermission('languages|use')) {
      const languages = await Language.paginate(paginateOptions);
      res.json(languages);
      return;
    }

    const languages = await Language.paginate({
      ...paginateOptions,
      ...visibilityScope(userId),
      subQuery: false,
    });

    res.json(languages);
  };

  const locales = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SystemLocaleReferences>
  ): Promise<void> => {
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const paginateOptions: PaginateOptions<SystemLocale> = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'code', 'englishName', 'localName'],
      columns: ['code', 'englishName', 'localName'],
      order: [[fn('lower', col('Locale.code')), 'ASC']],
    };

    if (await aclService.hasPermission('locales|use')) {
      const locales = await SystemLocale.paginate(paginateOptions);
      res.json(locales);
      return;
    }

    const locales = await SystemLocale.paginate({
      ...paginateOptions,
      ...visibilityScope(userId),
      subQuery: false,
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
      order: [[fn('lower', col('id')), 'ASC']],
    });

    res.json(nutrientTables);
  };

  const nutrientTableRecords = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<NutrientTableRecordReferences>
  ): Promise<void> => {
    const {
      params: { nutrientTableId },
    } = req;

    const nutrientTableRecords = await NutrientTableRecord.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'localName', 'nutrientTableRecordId'],
      where: { nutrientTableId },
      order: [[fn('lower', col('NutrientTableRecord.name')), 'ASC']],
    });

    res.json(nutrientTableRecords);
  };

  const nutrientTypes = async (
    req: Request<any, any, any, PaginateQuery & { nutrientTableId: string | string[] }>,
    res: Response<NutrientTypesResponse>
  ): Promise<void> => {
    const {
      query: { nutrientTableId },
    } = req;

    if (nutrientTableId) {
      const nutrientTypes = await FoodsNutrientType.paginate({
        query: pick(req.query, ['page', 'limit', 'sort', 'search']),
        attributes: ['id', 'description', 'unitId'],
        columns: ['description'],
        where: {
          id: {
            [Op.in]: literal(`(
              SELECT DISTINCT nutrient_type_id
              FROM nutrient_table_record_nutrients ntrn
              JOIN nutrient_table_records ntr ON ntr.id = ntrn.nutrient_table_record_id
              WHERE ntr.nutrient_table_id = '${nutrientTableId}')`),
          },
        },
        order: [['id', 'ASC']],
      });

      res.json(nutrientTypes);
      return;
    }

    const nutrientTypes = await FoodsNutrientType.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'description', 'unitId'],
      columns: ['description'],
      order: [['id', 'ASC']],
    });

    res.json(nutrientTypes);
  };

  const standardUnits = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveySchemesResponse>
  ): Promise<void> => {
    const standardUnits = await StandardUnit.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      attributes: ['id', 'name', 'estimateIn', 'howMany'],
      columns: ['id', 'name'],
      order: [[fn('lower', col('id')), 'ASC']],
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
      order: [[fn('lower', col('name')), 'ASC']],
    });
    res.json(surveys);
  };

  const surveySchemes = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveySchemeReferences>
  ): Promise<void> => {
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const paginateOptions: PaginateOptions<SurveyScheme> = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name'],
      order: [[fn('lower', col('SurveyScheme.name')), 'ASC']],
    };

    if (await aclService.hasPermission('survey-schemes|use')) {
      const surveySchemes = await SurveyScheme.paginate(paginateOptions);
      res.json(surveySchemes);
      return;
    }

    const surveySchemes = await SurveyScheme.paginate({
      ...paginateOptions,
      ...visibilityScope(userId),
      subQuery: false,
    });

    res.json(surveySchemes);
  };

  return {
    asServedSets,
    categories,
    drinkwareSets,
    feedbackSchemes,
    foodGroups,
    foods,
    guideImages,
    imageMaps,
    languages,
    locales,
    nutrientTables,
    nutrientTableRecords,
    nutrientTypes,
    standardUnits,
    surveys,
    surveySchemes,
  };
};

export default referenceController;

export type ReferenceController = ReturnType<typeof referenceController>;
