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
  const logger = globalLogger.child({ service: 'surveySubmissionsService' });

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
   * @param {T} idName
   * @param {string} id
   * @param {Dictionary<CustomPromptAnswer>} promptAnswers
   * @param {string[]} promptQuestions
   * @returns {CustomAnswers<T>[]}
   */
  const collectCustomAnswers = <T extends 'surveySubmissionId' | 'mealId' | 'foodId'>(
    idName: T,
    id: string,
    promptAnswers: Dictionary<CustomPromptAnswer>,
    promptQuestions: string[]
  ): CustomAnswers<T>[] => {
    const customAnswers = Object.entries(promptAnswers)
      .filter(([questionId]) => promptQuestions.includes(questionId))
      .map(([questionId, answer]) => ({
        [idName]: id,
        name: questionId,
        value: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
      }));

    return customAnswers as CustomAnswers<T>[];
  };

  /**
   * Process survey state and submit recall
   *
   * @param {string} slug
   * @param {User} user
   * @param {SurveyState} surveyState
   * @param {number} tzOffset
   * @returns {Promise<SurveyFollowUpResponse>}
   */
  const submit = async (
    slug: string,
    user: User,
    surveyState: SurveyState,
    tzOffset: number
  ): Promise<SurveyFollowUpResponse> => {
    const survey = await Survey.findOne({
      where: { slug },
      include: [{ association: 'surveyScheme', required: true }, { association: 'feedbackScheme' }],
    });
    if (!survey || !survey.surveyScheme) throw new NotFoundError();

    const {
      id: surveyId,
      localeId,
      surveyScheme: {
        questions: {
          preMeals,
          postMeals,
          meals: { foods, preFoods, postFoods },
        },
      },
      submissionNotificationUrl,
    } = survey;

    const { id: userId } = user;

    const surveyCustomQuestions = [...preMeals, ...postMeals]
      .filter((question) => question.type === 'custom')
      .map((question) => question.id);

    const mealCustomQuestions = [...preFoods, ...postFoods]
      .filter((question) => question.type === 'custom')
      .map((question) => question.id);

    const foodCustomQuestions = foods
      .filter((question) => question.type === 'custom')
      .map((question) => question.id);

    /*
     * TODO: this could be pushed to background job
     * - store state in DB for processing, processed as job, deleted successfully process data or mark as an issue in Admin Tool to reconcile
     * - response to user is not delayed by processing bigger amount of data
     * - it depends, whether we want to throw any errors / discrepancies back to user
     * - all submission data should be validated in frontend, user probably won't be able to do any corrections unless specifically allowed?
     * - critical data (inserted in DB) should be also validated in backend
     */

    return db.system.transaction(async (transaction) => {
      // Survey submission
      const { id: surveySubmissionId } = await SurveySubmission.create(
        {
          id: randomUUID(),
          surveyId,
          userId,
          startTime: surveyState.startTime ?? new Date(),
          endTime: surveyState.endTime ?? new Date(),
          uxSessionId: randomUUID(), // TODO: verify this (assigned in UI?)
          submissionTime: new Date(),
        },
        { transaction }
      );

      // Collect survey custom fields
      const surveyCustomFieldInputs = collectCustomAnswers(
        'surveySubmissionId',
        surveySubmissionId,
        surveyState.customPromptAnswers,
        surveyCustomQuestions
      );

      // Collect meals
      const mealInputs = surveyState.meals.map(({ name: { en: name }, time }) => ({
        surveySubmissionId,
        name,
        hours: time?.hours ?? 8,
        minutes: time?.minutes ?? 0,
      }));

      // Store survey custom fields & meals
      await Promise.all([
        SurveySubmissionCustomField.bulkCreate(surveyCustomFieldInputs, { transaction }),
        SurveySubmissionMeal.bulkCreate(mealInputs, { transaction }),
      ]);

      // Fetch created meal records
      const meals = await SurveySubmissionMeal.findAll({
        where: { surveySubmissionId },
        order: [['id', 'ASC']],
        transaction,
      });

      // Collect food & group codes
      const { foodCodes, groupCodes } = surveyState.meals.reduce<FoodCodes>(
        (acc, meal) => {
          const { foodCodes, groupCodes } = collectFoodCodes(meal.foods);
          acc.foodCodes.push(...foodCodes);
          acc.groupCodes.push(...groupCodes);

          return acc;
        },
        { foodCodes: [], groupCodes: [] }
      );

      // Fetch food & group records
      // TODO: if food record not found, look for prototype?
      const [foodRecords, foodGroups] = await Promise.all([
        FoodLocal.findAll({
          where: { foodCode: foodCodes, localeId },
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
          include: [{ association: 'localGroups', where: { localeId }, required: false }],
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
      for (const [idx, mealState] of surveyState.meals.entries()) {
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
            ].map(Boolean)
          );
        }
      }

      // Clean user submissions cache and dispatch submission webhook if any
      await Promise.all(
        [
          cache.forget(`user:submissions:${userId}`),
          submissionNotificationUrl
            ? scheduler.jobs.addJob(
                { type: 'SurveySubmissionNotification', userId },
                { surveyId, submissionId: surveySubmissionId }
              )
            : null,
        ].map(Boolean)
      );

      const [followUpUrl, userInfo] = await Promise.all([
        surveyService.getFollowUpUrl(survey, userId),
        surveyService.userInfo(survey, user, tzOffset),
      ]);

      return { ...userInfo, followUpUrl };
    });
  };

  return { submit };
};

export default surveySubmissionService;

export type SurveySubmissionService = ReturnType<typeof surveySubmissionService>;
