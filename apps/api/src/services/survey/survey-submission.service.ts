import { randomUUID } from 'node:crypto';

import type { IoC } from '@intake24/api/ioc';
import type {
  CustomPromptAnswer,
  Dictionary,
  FoodState,
  SurveyState,
  WithKey,
} from '@intake24/common/types';
import type { SurveyFollowUpResponse } from '@intake24/common/types/http';
import type {
  SurveySubmissionFieldCreationAttributes,
  SurveySubmissionFoodCreationAttributes,
  SurveySubmissionNutrientCreationAttributes,
  SurveySubmissionPortionSizeFieldCreationAttributes,
} from '@intake24/common/types/models';
import type { User } from '@intake24/db';
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
  SurveySubmissionNutrient,
  SurveySubmissionPortionSizeField,
} from '@intake24/db';

import { portionSizeMappers } from './portion-size-mapper';

export type CustomAnswers<K extends string | number | symbol> = WithKey<K> & {
  name: string;
  value: string;
};

export type CollectedFoods = {
  states: FoodState[];
  inputs: SurveySubmissionFoodCreationAttributes[];
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
        if (food.type === 'free-text') {
          logger.error(`Submission: Free-text food record present in submission, skipping...`);
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
   * @param {string} mealId
   * @param {FoodLocalMap} foods
   * @param {FoodGroupMap} foodGroups
   * @returns
   */
  const collectFoods =
    (mealId: string, foods: FoodLocalMap, foodGroups: FoodGroupMap) =>
    (collectedFoods: CollectedFoods, foodState: FoodState) => {
      if (foodState.type === 'free-text') {
        logger.error(`Submission: Free-text food record present in submission, skipping...`);
        return collectedFoods;
      }

      const {
        data: { code, groupCode, readyMealOption, reasonableAmount, brandNames },
        linkedFoods,
        portionSize,
      } = foodState;

      const foodRecord = foods[code];
      const foodGroupRecord = foodGroups[groupCode];

      if (!foodRecord) {
        logger.error(`Submission: food code not found (${code}), skipping...`);
        return collectedFoods;
      }

      if (!foodGroupRecord) {
        logger.error(`Submission: food group code not found (${groupCode}), skipping...`);
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
        logger.error(`Submission: Missing nutrient mapping for food code (${code}), skipping...`);
        return collectedFoods;
      }

      const [nutrientTableRecord] = nutrientRecords;

      if (!portionSize) {
        logger.error(`Submission: Missing portion size data for food code (${code}), skipping...`);
        return collectedFoods;
      }

      // TODO: verify
      const portionSizeWeight =
        (portionSize.servingWeight ?? 0) - (portionSize.leftoversWeight ?? 0);

      collectedFoods.inputs.push({
        mealId,
        code,
        englishName,
        localName,
        readyMeal: readyMealOption,
        searchTerm: '???', // TODO
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

      if (linkedFoods.length) {
        const { states, inputs } = linkedFoods.reduce(collectFoods(mealId, foods, foodGroups), {
          inputs: [],
          states: [],
        });
        collectedFoods.inputs.push(...inputs);
        collectedFoods.states.push(...states);
      }

      return collectedFoods;
    };

  const collectFoodCompositionData = (
    foodId: string,
    foodState: FoodState,
    foods: FoodLocalMap
  ) => {
    const collectedData: CollectedNutrientInfo = { fields: [], nutrients: [], portionSizes: [] };

    if (foodState.type === 'free-text') {
      logger.error(`Submission: Free-text food record present in submission, skipping...`);
      return collectedData;
    }

    const {
      portionSize,
      data: { code },
    } = foodState;

    const foodRecord = foods[code];

    if (!foodRecord) {
      logger.error(`Submission: food code not found (${code}), skipping...`);
      return collectedData;
    }

    if (!foodRecord.main || !foodRecord.nutrientRecords)
      throw new Error('Submission: not loaded foodRecord relationships');

    if (!foodRecord.nutrientRecords.length) {
      logger.error(`Submission: Missing nutrient mapping for food code (${code}), skipping...`);
      return collectedData;
    }

    const [nutrientTableRecord] = foodRecord.nutrientRecords;

    if (!portionSize) {
      logger.error(`Submission: Missing portion size data for food code (${code}), skipping...`);
      return collectedData;
    }

    // TODO: verify
    const portionSizeWeight = (portionSize.servingWeight ?? 0) - (portionSize.leftoversWeight ?? 0);

    if (!nutrientTableRecord.nutrients || !nutrientTableRecord.fields)
      throw new Error('Submission: not loaded nutrient relationships');

    // Collect food composition fields
    collectedData.fields = nutrientTableRecord.fields.map(({ name, value }) => ({
      foodId,
      fieldName: name,
      value,
    }));

    // Collect food composition nutrients
    collectedData.nutrients = nutrientTableRecord.nutrients.map(
      ({ nutrientTypeId, unitsPer100g }) => ({
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
   * @param {string[]} promptQuestions
   * @returns {CustomAnswers<T>[]}
   */
  const collectCustomAnswers = <T extends 'surveySubmissionId' | 'mealId' | 'foodId'>(
    propId: T,
    id: string,
    promptAnswers: Dictionary<CustomPromptAnswer>,
    promptQuestions: string[]
  ): CustomAnswers<T>[] => {
    const customAnswers = Object.entries(promptAnswers)
      .filter(([name]) => promptQuestions.includes(name))
      .map(([name, answer]) => ({
        [propId]: id,
        name,
        value: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
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
   * @returns {Promise<SurveyFollowUpResponse>}
   */
  const submit = async (
    slug: string,
    user: User,
    state: SurveyState,
    tzOffset: number
  ): Promise<SurveyFollowUpResponse> => {
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
        questions: {
          preMeals,
          postMeals,
          meals: { foods, preFoods, postFoods },
        },
      },
      submissionNotificationUrl,
    } = survey;

    const surveyCustomQuestions = [...preMeals, ...postMeals]
      .filter(({ type }) => type === 'custom')
      .map(({ id }) => id);

    const mealCustomQuestions = [...preFoods, ...postFoods]
      .filter(({ type }) => type === 'custom')
      .map(({ id }) => id);

    const foodCustomQuestions = foods.filter(({ type }) => type === 'custom').map(({ id }) => id);

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
        surveyCustomQuestions
      );

      // Collect meals
      const mealInputs = state.meals.map(({ name: { en: name }, time }) => ({
        surveySubmissionId,
        name,
        hours: time?.hours ?? 0,
        minutes: time?.minutes ?? 0,
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
          params: { foodCodes },
        }),
        SurveySubmissionCustomField.bulkCreate(surveyCustomFieldInputs, { transaction }),
        SurveySubmissionMeal.bulkCreate(mealInputs, { transaction }),
      ]);

      // Fetch created meal records
      const meals = await SurveySubmissionMeal.findAll({
        where: { surveySubmissionId },
        order: [['id', 'ASC']],
        transaction,
      });

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

      const foodRecordMap = foodRecords.reduce<Record<string, FoodLocal>>((acc, item) => {
        acc[item.foodCode] = item;
        return acc;
      }, {});

      const foodGroupMap = foodGroups.reduce<Record<string, FoodGroup>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      // Process meals
      for (const [idx, mealState] of state.meals.entries()) {
        const { id: mealId } = meals[idx];

        // Collect meal custom fields
        const mealCustomFieldInputs = collectCustomAnswers(
          'mealId',
          mealId,
          mealState.customPromptAnswers,
          mealCustomQuestions
        );

        // Collect meal foods
        const collectedFoods = mealState.foods.reduce(
          collectFoods(mealId, foodRecordMap, foodGroupMap),
          { inputs: [], states: [] }
        );

        // TODO: missing foods

        // Store meal custom fields & foods
        await Promise.all([
          SurveySubmissionMealCustomField.bulkCreate(mealCustomFieldInputs, { transaction }),
          SurveySubmissionFood.bulkCreate(collectedFoods.inputs, { transaction }),
        ]);

        // Fetch created food records
        const foods = await SurveySubmissionFood.findAll({
          where: { mealId },
          order: [['id', 'ASC']],
          transaction,
        });

        // Process foods
        for (const [idx, foodState] of collectedFoods.states.entries()) {
          const { id: foodId } = foods[idx];

          const { customPromptAnswers } = foodState;

          // Collect food custom fields
          const foodCustomFieldInputs = collectCustomAnswers(
            'foodId',
            foodId,
            customPromptAnswers,
            foodCustomQuestions
          );

          // Collect food composition fields & food composition nutrients
          const { fields, nutrients, portionSizes } = collectFoodCompositionData(
            foodId,
            foodState,
            foodRecordMap
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
