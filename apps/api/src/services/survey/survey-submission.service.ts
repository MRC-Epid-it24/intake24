import { randomUUID } from 'node:crypto';

import type { IoC } from '@intake24/api/ioc';
import type {
  CustomPromptAnswer,
  Dictionary,
  EncodedFood,
  FoodState,
  MissingFood,
  RecipeBuilder,
  SurveyState,
  WithKey,
} from '@intake24/common/types';
import type { SurveySubmissionResponse } from '@intake24/common/types/http';
import type {
  SurveySubmissionFieldCreationAttributes,
  SurveySubmissionFoodCreationAttributes,
  SurveySubmissionMissingFoodCreationAttributes,
  SurveySubmissionNutrientCreationAttributes,
  SurveySubmissionPortionSizeFieldCreationAttributes,
} from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import {
  FoodGroup,
  FoodLocal,
  Survey,
  SurveySubmission,
  SurveySubmissionCustomField,
  SurveySubmissionField,
  SurveySubmissionFood,
  SurveySubmissionFoodCustomField,
  SurveySubmissionMeal,
  SurveySubmissionMealCustomField,
  SurveySubmissionMissingFood,
  SurveySubmissionNutrient,
  SurveySubmissionPortionSizeField,
} from '@intake24/db';

import { portionSizeMappers } from './portion-size-mapper';

export type CustomAnswers<K extends string | number | symbol> = WithKey<K> & {
  id: string;
  name: string;
  value: string;
};

export type CollectFoodsOps = {
  foodGroups: FoodGroupMap;
  foods: FoodLocalMap;
  mealId: string;
  parentId?: string;
};

export type CollectedFoods = {
  inputs: SurveySubmissionFoodCreationAttributes[];
  states: (EncodedFood | RecipeBuilder)[];
  missingInputs: SurveySubmissionMissingFoodCreationAttributes[];
  missingStates: MissingFood[];
};

export type CollectedNutrientInfo = {
  nutrients: SurveySubmissionNutrientCreationAttributes[];
  fields: SurveySubmissionFieldCreationAttributes[];
  portionSizes: SurveySubmissionPortionSizeFieldCreationAttributes[];
};

export type FoodLocalMap = Record<string, FoodLocal>;
export type FoodGroupMap = Record<string, FoodGroup>;

export type FoodCodes = { foodCodes: string[]; groupCodes: string[] };

const surveySubmissionService = ({
  cache,
  db,
  logger: globalLogger,
  scheduler,
  surveyService,
}: Pick<IoC, 'cache' | 'db' | 'logger' | 'scheduler' | 'surveyService'>) => {
  const logger = globalLogger.child({ service: 'SurveySubmissionsService' });

  /**
   * Collect food and food group codes from submission state
   *
   * @param {FoodState[]} foods
   */
  const collectFoodCodes = (foods: FoodState[]) =>
    foods.reduce<FoodCodes>(
      (acc, food) => {
        const { linkedFoods, type } = food;
        if (type === 'free-text') {
          logger.warn(`Submission: ${type} food record present in 'collectFoodCodes, skipping...`);
          return acc;
        }

        if (type === 'encoded-food') {
          acc.foodCodes.push(food.data.code);
          acc.groupCodes.push(food.data.groupCode);
        }

        if (linkedFoods.length) {
          const { foodCodes, groupCodes } = collectFoodCodes(linkedFoods);
          acc.foodCodes.push(...foodCodes);
          acc.groupCodes.push(...groupCodes);
        }

        return acc;
      },
      { foodCodes: [], groupCodes: [] }
    );

  /**
   * Collect foods from submissions state
   *
   * @param {CollectFoodsOps} ops
   */
  const collectFoods =
    (ops: CollectFoodsOps) =>
    (collectedFoods: CollectedFoods, foodState: FoodState): CollectedFoods => {
      const { foodGroups, foods, mealId, parentId } = ops;

      if (foodState.type === 'free-text') {
        logger.warn(`Submission: ${foodState.type} food record present in submission, skipping...`);
        return collectedFoods;
      }

      if (foodState.type === 'missing-food') {
        const { info } = foodState;
        if (!info) {
          logger.warn(`Submission: ${foodState.type} without info, skipping...`);
          return collectedFoods;
        }

        collectedFoods.missingInputs.push({
          ...info,
          id: randomUUID(),
          parentId,
          mealId,
          index: collectedFoods.inputs.length + collectedFoods.missingInputs.length,
        });
        collectedFoods.missingStates.push(foodState);

        return collectedFoods;
      }

      if (foodState.type === 'recipe-builder') {
        const { linkedFoods, searchTerm, template } = foodState;

        const foodGroupRecord = foodGroups['0'];

        if (!foodGroupRecord) {
          logger.warn(`Submission: food group '0' not found, skipping...`);
          return collectedFoods;
        }

        if (!foodGroupRecord.localGroups)
          throw new Error('Submission: not loaded foodGroupRecord relationships');

        const { id: foodGroupId, name: foodGroupEnglishName, localGroups } = foodGroupRecord;
        const id = randomUUID();

        collectedFoods.inputs.push({
          id,
          parentId,
          mealId,
          index: collectedFoods.inputs.length + collectedFoods.missingInputs.length,
          code: template.code,
          englishName: template.name,
          localName: template.name,
          readyMeal: false,
          searchTerm: (searchTerm ?? '').slice(0, 256),
          portionSizeMethodId: 'recipe-builder',
          reasonableAmount: true,
          foodGroupId,
          foodGroupEnglishName,
          foodGroupLocalName: localGroups[0]?.name ?? foodGroupEnglishName,
          brand: null,
          barcode: null,
          nutrientTableId: '',
          nutrientTableCode: '',
        });
        collectedFoods.states.push(foodState);

        return linkedFoods.reduce(
          collectFoods({ foodGroups, foods, mealId, parentId: id }),
          collectedFoods
        );
      }

      const {
        data: { code, groupCode, reasonableAmount, localName },
        flags,
        linkedFoods,
        portionSize,
        searchTerm,
      } = foodState;

      const foodRecord = foods[code];
      const foodGroupRecord = foodGroups[groupCode];

      if (!foodRecord) {
        logger.warn(`Submission: food '${code}' not found, skipping...`);
        return collectedFoods;
      }

      if (!foodGroupRecord) {
        logger.warn(`Submission: food group '${groupCode}' not found, skipping...`);
        return collectedFoods;
      }

      if (!foodRecord.main || !foodRecord.nutrientRecords || !foodGroupRecord.localGroups)
        throw new Error('Submission: not loaded foodRecord/foodGroupRecord relationships');

      const {
        nutrientRecords,
        main: { name: englishName },
      } = foodRecord;
      const { id: foodGroupId, name: foodGroupEnglishName, localGroups } = foodGroupRecord;

      if (!portionSize) {
        logger.warn(`Submission: Missing portion size data for food code (${code}), skipping...`);
        return collectedFoods;
      }

      const portionSizeWeight =
        (portionSize.servingWeight ?? 0) - (portionSize.leftoversWeight ?? 0);
      const id = randomUUID();

      collectedFoods.inputs.push({
        id,
        parentId,
        mealId,
        index: collectedFoods.inputs.length + collectedFoods.missingInputs.length,
        code,
        englishName,
        localName,
        readyMeal: flags.includes('ready-meal'),
        searchTerm: (searchTerm ?? '').slice(0, 256),
        portionSizeMethodId: portionSize.method,
        reasonableAmount: reasonableAmount >= portionSizeWeight,
        foodGroupId,
        foodGroupEnglishName,
        foodGroupLocalName: localGroups[0]?.name ?? foodGroupEnglishName,
        brand: null,
        barcode: null,
        nutrientTableId: nutrientRecords[0]?.nutrientTableId ?? '0',
        nutrientTableCode: nutrientRecords[0]?.nutrientTableRecordId ?? '0',
      });
      collectedFoods.states.push(foodState);

      return linkedFoods.reduce(
        collectFoods({ foodGroups, foods, mealId, parentId: id }),
        collectedFoods
      );
    };

  const collectFoodCompositionData = (
    foodId: string,
    foodState: EncodedFood | RecipeBuilder,
    foods: FoodLocalMap
  ) => {
    const collectedData: CollectedNutrientInfo = { fields: [], nutrients: [], portionSizes: [] };

    if (foodState.type === 'recipe-builder') return collectedData;

    const {
      portionSize,
      data: { code },
    } = foodState;

    const foodRecord = foods[code];

    if (!foodRecord) {
      logger.warn(`Submission: food code not found (${code}), skipping...`);
      return collectedData;
    }

    if (!foodRecord.main || !foodRecord.nutrientRecords)
      throw new Error('Submission: not loaded foodRecord relationships');

    if (!portionSize) {
      logger.warn(`Submission: Missing portion size data for food code (${code}), skipping...`);
      return collectedData;
    }

    const portionSizeWeight = (portionSize.servingWeight ?? 0) - (portionSize.leftoversWeight ?? 0);

    // Collect portion sizes data
    collectedData.portionSizes = portionSizeMappers[portionSize.method](foodId, portionSize);

    // Bail if no nutrient record links - missing encoded food link
    if (!foodRecord.nutrientRecords.length) {
      logger.warn(`Submission: Missing nutrient mapping for food code (${code}), skipping...`);
      return collectedData;
    }

    const [nutrientTableRecord] = foodRecord.nutrientRecords;
    if (!nutrientTableRecord.nutrients || !nutrientTableRecord.fields)
      throw new Error('Submission: not loaded nutrient relationships');

    // Collect food composition fields
    collectedData.fields = nutrientTableRecord.fields.map(({ name, value }) => ({
      id: randomUUID(),
      foodId,
      fieldName: name,
      value,
    }));

    // Collect food composition nutrients
    collectedData.nutrients = nutrientTableRecord.nutrients.map(
      ({ nutrientTypeId, unitsPer100g }) => ({
        id: randomUUID(),
        foodId,
        nutrientTypeId,
        amount: (unitsPer100g * portionSizeWeight) / 100.0,
      })
    );

    return collectedData;
  };

  /**
   * Collect custom prompt answers as custom fields
   *
   * @template T
   * @param {T} propId
   * @param {string} id
   * @param {Dictionary<CustomPromptAnswer>} promptAnswers
   * @param {string[]} prompts
   * @returns {CustomAnswers<T>[]}
   */
  const collectCustomAnswers = <T extends 'surveySubmissionId' | 'mealId' | 'foodId'>(
    propId: T,
    id: string,
    promptAnswers: Dictionary<CustomPromptAnswer>,
    prompts: string[]
  ): CustomAnswers<T>[] => {
    const customAnswers = Object.entries(promptAnswers)
      .filter(([name]) => prompts.includes(name))
      .map(([name, answer]) => ({
        id: randomUUID(),
        [propId]: id,
        name,
        value: Array.isArray(answer) ? answer.join(', ') : answer?.toString() ?? 'N/A',
      }));

    return customAnswers as CustomAnswers<T>[];
  };

  /**
   * Submit recall
   *
   * @param {string} slug
   * @param {string} userId
   * @param {SurveyState} state
   * @param {number} tzOffset
   * @returns {Promise<SurveySubmissionResponse>}
   */
  const submit = async (
    slug: string,
    userId: string,
    state: SurveyState,
    tzOffset: number
  ): Promise<SurveySubmissionResponse> => {
    const survey = await Survey.findBySlug(slug, {
      attributes: [
        'id',
        'feedbackSchemeId',
        'maximumTotalSubmissions',
        'maximumDailySubmissions',
        'numberOfSubmissionsForFeedback',
      ],
      include: [{ association: 'surveyScheme', attributes: ['prompts'], required: true }],
    });
    if (!survey) throw new NotFoundError();

    const { id: surveyId } = survey;
    const submission = { id: randomUUID(), submissionTime: new Date() };

    const [userInfo, followUpUrl] = await Promise.all([
      surveyService.userInfo(survey, userId, tzOffset, 1),
      surveyService.getFollowUpUrl(survey, userId),
    ]);

    await scheduler.jobs.addJob({
      type: 'SurveySubmission',
      userId,
      params: { surveyId, userId, state: { ...state, ...submission } },
    });

    return { ...userInfo, followUpUrl, submission };
  };

  /**
   * Process survey submission
   *
   * @param {string} surveyId
   * @param {string} userId
   * @param {SurveyState} state
   * @returns {Promise<void>}
   */
  const processSubmission = async (
    surveyId: string,
    userId: string,
    state: SurveyState
  ): Promise<void> => {
    const { uxSessionId: sessionId } = state;

    const [survey, submission] = await Promise.all([
      Survey.findOne({
        attributes: ['id', 'notifications', 'searchCollectData'],
        where: { id: surveyId },
        include: [
          { association: 'locale', attributes: ['id', 'code'], required: true },
          { association: 'surveyScheme', attributes: ['id', 'prompts'], required: true },
        ],
      }),
      SurveySubmission.findOne({ attributes: ['id'], where: { surveyId, userId, sessionId } }),
    ]);
    if (!survey || !survey.locale || !survey.surveyScheme) throw new NotFoundError();

    if (submission) {
      throw new Error(
        `Duplicate submission for surveyId: ${surveyId}, userId: ${userId}, sessionId: ${sessionId}`
      );
    }

    const {
      locale: { code: localeCode },
      surveyScheme: {
        prompts: {
          preMeals,
          postMeals,
          meals: { foods, preFoods, postFoods },
        },
      },
      notifications,
      searchCollectData,
    } = survey;

    const submissionCustomPrompts = [...preMeals, ...postMeals]
      .filter(({ type }) => type === 'custom')
      .map(({ id }) => id);

    const mealCustomPrompts = [...preFoods, ...postFoods]
      .filter(({ type }) => type === 'custom')
      .map(({ id }) => id);

    const foodCustomPrompts = foods.filter(({ type }) => type === 'custom').map(({ id }) => id);

    await db.system.transaction(async (transaction) => {
      const { startTime, endTime, userAgent } = state;
      const submissionTime = state.submissionTime ?? new Date();
      const id = state.id ?? randomUUID();

      if (!startTime || !endTime) {
        logger.warn('Submission: missing startTime / endTime on submission state.', {
          surveyId,
          userId,
          submissionTime,
        });
      }

      // Survey submission
      const { id: surveySubmissionId } = await SurveySubmission.create(
        {
          id,
          surveyId,
          userId,
          startTime: startTime ?? submissionTime,
          endTime: endTime ?? submissionTime,
          submissionTime,
          sessionId,
          userAgent,
        },
        { transaction }
      );

      // Collect submission custom fields
      const submissionCustomFieldInputs = collectCustomAnswers(
        'surveySubmissionId',
        surveySubmissionId,
        state.customPromptAnswers,
        submissionCustomPrompts
      );

      // Collect meals
      const mealInputs = state.meals.map(({ name: { en: name }, time, duration }) => ({
        id: randomUUID(),
        surveySubmissionId,
        name,
        hours: time?.hours ?? 0,
        minutes: time?.minutes ?? 0,
        duration,
      }));

      // Collect food & group codes
      const { foodCodes, groupCodes } = state.meals.reduce<FoodCodes>(
        (acc, meal) => {
          const { foodCodes, groupCodes } = collectFoodCodes(meal.foods);
          acc.foodCodes.push(...foodCodes);
          acc.groupCodes.push(...groupCodes);

          return acc;
        },
        { foodCodes: [], groupCodes: ['0'] }
      );

      // Store survey custom fields & meals
      await Promise.all(
        [
          SurveySubmissionCustomField.bulkCreate(submissionCustomFieldInputs, { transaction }),
          SurveySubmissionMeal.bulkCreate(mealInputs, { transaction }),
          searchCollectData
            ? scheduler.jobs.addJob({
                type: 'PopularitySearchUpdateCounters',
                userId,
                params: { localeCode, foodCodes },
              })
            : null,
        ].filter(Boolean)
      );

      // Fetch food & group records
      // TODO: if food record not found, look for prototype?
      const [foodRecords, foodGroups] = await Promise.all([
        FoodLocal.findAll({
          where: { foodCode: foodCodes, localeId: localeCode },
          include: [
            { association: 'main' },
            {
              association: 'nutrientRecords',
              through: { attributes: [] },
              include: [{ association: 'fields' }, { association: 'nutrients' }],
            },
          ],
        }),
        FoodGroup.findAll({
          where: { id: groupCodes },
          include: [
            { association: 'localGroups', where: { localeId: localeCode }, required: false },
          ],
        }),
      ]);

      const foodMap = foodRecords.reduce<Record<string, FoodLocal>>((acc, item) => {
        acc[item.foodCode] = item;
        return acc;
      }, {});

      const foodGroupMap = foodGroups.reduce<Record<string, FoodGroup>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      // Process meals
      for (const [idx, mealState] of state.meals.entries()) {
        const { id: mealId } = mealInputs[idx];

        // Collect meal custom fields
        const mealCustomFieldInputs = collectCustomAnswers(
          'mealId',
          mealId,
          mealState.customPromptAnswers,
          mealCustomPrompts
        );

        // Collect meal foods
        const collectedFoods = mealState.foods.reduce(
          collectFoods({ foods: foodMap, foodGroups: foodGroupMap, mealId }),
          {
            inputs: [],
            states: [],
            missingInputs: [],
            missingStates: [],
          }
        );

        // Store meal custom fields & foods
        await Promise.all([
          SurveySubmissionMealCustomField.bulkCreate(mealCustomFieldInputs, { transaction }),
          SurveySubmissionFood.bulkCreate(collectedFoods.inputs, { transaction }),
          SurveySubmissionMissingFood.bulkCreate(collectedFoods.missingInputs, { transaction }),
        ]);

        // Process foods
        for (const [idx, foodState] of collectedFoods.states.entries()) {
          const { id: foodId } = collectedFoods.inputs[idx];

          const { customPromptAnswers } = foodState;

          // Collect food custom fields
          const foodCustomFieldInputs = collectCustomAnswers(
            'foodId',
            foodId,
            customPromptAnswers,
            foodCustomPrompts
          );

          // Collect food composition fields & food composition nutrients
          const { fields, nutrients, portionSizes } = collectFoodCompositionData(
            foodId,
            foodState,
            foodMap
          );

          // Store food custom fields, food composition fields, food composition nutrients, PSMs
          await Promise.all(
            [
              SurveySubmissionFoodCustomField.bulkCreate(foodCustomFieldInputs, { transaction }),
              fields.length ? SurveySubmissionField.bulkCreate(fields, { transaction }) : null,
              nutrients.length
                ? SurveySubmissionNutrient.bulkCreate(nutrients, { transaction })
                : null,
              portionSizes.length
                ? SurveySubmissionPortionSizeField.bulkCreate(portionSizes, { transaction })
                : null,
            ].filter(Boolean)
          );
        }
      }

      const hasNotifications =
        notifications.length &&
        notifications.some(({ type }) => type === 'survey.session.submitted');

      // Clean user submissions cache and dispatch submission notification if any
      await Promise.all(
        [
          cache.forget(`user-submissions:${userId}`),
          hasNotifications
            ? scheduler.jobs.addJob({
                type: 'SurveyEventNotification',
                userId,
                params: {
                  type: 'survey.session.submitted',
                  sessionId,
                  surveyId,
                  submissionId: surveySubmissionId,
                  userId,
                },
              })
            : null,
        ].filter(Boolean)
      );
    });
  };

  return { processSubmission, submit };
};

export default surveySubmissionService;

export type SurveySubmissionService = ReturnType<typeof surveySubmissionService>;
