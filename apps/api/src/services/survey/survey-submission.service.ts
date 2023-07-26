import { randomUUID } from 'node:crypto';

import type { IoC } from '@intake24/api/ioc';
import type {
  CustomPromptAnswer,
  Dictionary,
  EncodedFood,
  FoodState,
  MissingFood,
  SurveyState,
  WithKey,
} from '@intake24/common/types';
import type { SurveyUserInfoResponse } from '@intake24/common/types/http';
import type {
  SurveySubmissionFieldCreationAttributes,
  SurveySubmissionFoodCreationAttributes,
  SurveySubmissionMissingFoodCreationAttributes,
  SurveySubmissionNutrientCreationAttributes,
  SurveySubmissionPortionSizeFieldCreationAttributes,
  User,
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
  states: EncodedFood[];
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
        if (food.type !== 'encoded-food') {
          if (food.type === 'free-text')
            logger.warn(
              `Submission: ${food.type} food record present in 'collectFoodCodes, skipping...`
            );
          return acc;
        }

        const {
          data: { code, groupCode },
          linkedFoods,
        } = food;

        acc.foodCodes.push(code);
        acc.groupCodes.push(groupCode);

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

      const {
        data: { code, groupCode, reasonableAmount, brandNames },
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
        throw new Error('Submission: not loaded foodRecord relationships');

      const {
        nutrientRecords,
        name: localName,
        main: { name: englishName },
      } = foodRecord;
      const { id: foodGroupId, name: foodGroupEnglishName, localGroups } = foodGroupRecord;

      if (!nutrientRecords.length) {
        logger.warn(`Submission: Missing nutrient mapping for food code (${code}), skipping...`);
        return collectedFoods;
      }

      const [nutrientTableRecord] = nutrientRecords;

      if (!portionSize) {
        logger.warn(`Submission: Missing portion size data for food code (${code}), skipping...`);
        return collectedFoods;
      }

      // TODO: verify
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
        searchTerm,
        portionSizeMethodId: portionSize.method,
        reasonableAmount: reasonableAmount >= portionSizeWeight, // TODO: verify
        foodGroupId,
        foodGroupEnglishName,
        foodGroupLocalName: localGroups[0]?.name ?? foodGroupEnglishName,
        brand: brandNames.join(' '),
        nutrientTableId: nutrientTableRecord.nutrientTableId,
        nutrientTableCode: nutrientTableRecord.nutrientTableRecordId,
      });
      collectedFoods.states.push(foodState);

      return linkedFoods.reduce(
        collectFoods({ foodGroups, foods, mealId, parentId: id }),
        collectedFoods
      );
    };

  const collectFoodCompositionData = (
    foodId: string,
    foodState: FoodState,
    foods: FoodLocalMap
  ) => {
    const collectedData: CollectedNutrientInfo = { fields: [], nutrients: [], portionSizes: [] };

    if (foodState.type !== 'encoded-food') {
      logger.warn(
        `Submission: ${foodState.type} food record present in 'collectFoodCompositionData', skipping...`
      );
      return collectedData;
    }

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

    if (!foodRecord.nutrientRecords.length) {
      logger.warn(`Submission: Missing nutrient mapping for food code (${code}), skipping...`);
      return collectedData;
    }

    const [nutrientTableRecord] = foodRecord.nutrientRecords;

    if (!portionSize) {
      logger.warn(`Submission: Missing portion size data for food code (${code}), skipping...`);
      return collectedData;
    }

    // TODO: verify
    const portionSizeWeight = (portionSize.servingWeight ?? 0) - (portionSize.leftoversWeight ?? 0);

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

    // Collect portion sizes data
    collectedData.portionSizes = portionSizeMappers[portionSize.method](foodId, portionSize);

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
   * Process survey state and submit recall
   *
   * @param {string} slug
   * @param {User} user
   * @param {SurveyState} state
   * @param {number} tzOffset
   * @returns {Promise<SurveyUserInfoResponse>}
   */
  const submit = async (
    slug: string,
    user: User,
    state: SurveyState,
    tzOffset: number
  ): Promise<SurveyUserInfoResponse> => {
    const survey = await Survey.findOne({
      where: { slug },
      include: [{ association: 'surveyScheme', required: true }],
    });
    if (!survey) throw new NotFoundError();

    const { id: surveyId } = survey;
    const { id: userId } = user;

    const [userInfo, followUpUrl] = await Promise.all([
      surveyService.userInfo(survey, user, tzOffset, 1),
      surveyService.getFollowUpUrl(survey, userId),
      surveyService.clearSession(slug, userId),
    ]);

    await scheduler.jobs.addJob({
      type: 'SurveySubmission',
      userId,
      params: { surveyId, userId, state },
    });

    return { ...userInfo, followUpUrl };
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
    const { uxSessionId } = state;

    const [survey, submission] = await Promise.all([
      Survey.findOne({
        where: { id: surveyId },
        include: [
          { association: 'locale', required: true },
          { association: 'surveyScheme', required: true },
          { association: 'feedbackScheme' },
        ],
      }),
      SurveySubmission.findOne({ where: { surveyId, userId, uxSessionId } }),
    ]);
    if (!survey || !survey.locale || !survey.surveyScheme) throw new NotFoundError();

    if (submission) {
      throw new Error(
        `Duplicate submission for surveyId: ${surveyId}, userId: ${userId}, uxSessionId: ${uxSessionId}`
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
      submissionNotificationUrl,
    } = survey;

    const surveyCustomPrompts = [...preMeals, ...postMeals]
      .filter(({ type }) => type === 'custom')
      .map(({ id }) => id);

    const mealCustomPrompts = [...preFoods, ...postFoods]
      .filter(({ type }) => type === 'custom')
      .map(({ id }) => id);

    const foodCustomPrompts = foods.filter(({ type }) => type === 'custom').map(({ id }) => id);

    await db.system.transaction(async (transaction) => {
      const { startTime, endTime, userAgent } = state;
      const submissionTime = new Date();

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
          id: randomUUID(),
          surveyId,
          userId,
          startTime: startTime ?? submissionTime,
          endTime: endTime ?? submissionTime,
          submissionTime,
          uxSessionId,
          userAgent,
        },
        { transaction }
      );

      // Collect survey custom fields
      const surveyCustomFieldInputs = collectCustomAnswers(
        'surveySubmissionId',
        surveySubmissionId,
        state.customPromptAnswers,
        surveyCustomPrompts
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
        { foodCodes: [], groupCodes: [] }
      );

      // Store survey custom fields & meals
      await Promise.all([
        scheduler.jobs.addJob({
          type: 'PopularitySearchUpdateCounters',
          userId,
          params: { localeCode, foodCodes },
        }),
        SurveySubmissionCustomField.bulkCreate(surveyCustomFieldInputs, { transaction }),
        SurveySubmissionMeal.bulkCreate(mealInputs, { transaction }),
      ]);

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
          { inputs: [], states: [], missingInputs: [], missingStates: [] }
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

      // Clean user submissions cache and dispatch submission webhook if any
      await Promise.all(
        [
          cache.forget(`user:submissions:${userId}`),
          submissionNotificationUrl
            ? scheduler.jobs.addJob({
                type: 'SurveySubmissionNotification',
                userId,
                params: { surveyId, submissionId: surveySubmissionId },
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
