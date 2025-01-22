import type { SetupContext } from 'vue';
import type { UseFoodUtilsProps } from './use-food-utils';

import type { UseMealUtilsProps } from './use-meal-utils';
import { computed, ref } from 'vue';
import type { Prompts } from '@intake24/common/prompts';
import type { EncodedFood, FoodState, PromptSection, RecipeBuilder } from '@intake24/common/surveys';
import type { PartialRecord } from '@intake24/common/types';
import type { LocaleContentOptions } from '@intake24/i18n';
import { useI18n } from '@intake24/i18n';

import { useSurvey } from '@intake24/survey/stores';
import { promptType } from '@intake24/ui';
import { useFoodUtils } from './use-food-utils';
import { useMealUtils } from './use-meal-utils';

export type UsePromptPropsBase<P extends keyof Prompts> = {
  prompt: Prompts[P];
  section?: PromptSection;
};

export type UsePromptProps<
  P extends keyof Prompts,
  F extends FoodState | undefined,
  FP extends EncodedFood | RecipeBuilder | undefined,
> = UsePromptPropsBase<P> & UseFoodUtilsProps<F, FP> & UseMealUtilsProps;

export function usePromptUtils<
  P extends keyof Prompts,
  F extends FoodState | undefined,
  FP extends EncodedFood | RecipeBuilder | undefined,
>(props: UsePromptProps<P, F, FP>, { emit }: Pick<SetupContext<'action'[]>, 'emit'>, confirmCallback?: () => boolean) {
  const { i18n: { d, t } } = useI18n();
  const survey = useSurvey();
  const surveySlug = computed(() => survey.parameters?.slug);
  const { mealName, mealTime, getMealTime } = useMealUtils(props);
  const { foodName, getFoodName } = useFoodUtils(props);

  const isFood = computed(() => !!props.food && !!props.meal);
  const isMeal = computed(() => !!props.meal && !props.food);
  const isInMultiPrompt = computed(() => !!(props.prompt.type === 'custom' && props.prompt.group));
  const customPromptLayout = computed(() =>
    isInMultiPrompt.value ? 'panel-layout' : 'card-layout',
  );
  const foodOrMealName = computed(() => foodName.value ?? mealName.value ?? '');

  const errors = ref<string[]>([]);
  const hasErrors = computed(() => !!errors.value.length);
  const clearErrors = () => {
    errors.value = [];
  };

  const type = computed(() => promptType(props.prompt.component));

  const recipeBuilderEnabled = computed(() => type.value === 'foodSearch' && survey.registeredPortionSizeMethods.includes('recipe-builder'),
  );

  const params = computed(() => {
    const build: Record<string, string | number> = {
      recallNumber: survey.recallNumber,
      userName: survey.user?.name ?? '',
      recallDate: survey.recallDate ? d(survey.recallDate, 'recallDate') : '',
    };

    if (foodName.value) {
      if (isFood.value)
        build.item = foodName.value;

      build.food = foodName.value;
    }

    if (mealName.value) {
      build.mealName = mealName.value;

      if (mealTime.value) {
        build.mealTime = mealTime.value;

        const meal = `${mealName.value} (${mealTime.value})`;
        if (isMeal.value)
          build.item = meal;

        build.meal = meal;
      }
      else {
        if (isMeal.value)
          build.item = mealName.value;
        build.meal = mealName.value;
      }
    }

    return build;
  });

  const translatePrompt = <T extends string>(
    keys: T[],
    params: PartialRecord<T, LocaleContentOptions['params']> = {},
  ) => {
    return keys.reduce(
      (acc, key) => {
        acc[key] = t(`prompts.${type.value}.${key}`, params[key] ?? {});
        return acc;
      },
      {} as Record<T, string>,
    );
  };

  const action = (type: string, ...args: [id?: string, params?: object]) => {
    if (type !== 'next') {
      emit('action', type, ...args);
      return;
    }

    if (confirmCallback && !confirmCallback())
      return;

    emit('action', type, ...args);
  };

  return {
    action,
    clearErrors,
    customPromptLayout,
    errors,
    surveySlug,
    foodName,
    foodOrMealName,
    getFoodName,
    getMealTime,
    hasErrors,
    isFood,
    isMeal,
    isInMultiPrompt,
    mealName,
    params,
    recipeBuilderEnabled,
    translatePrompt,
    type,
  };
}
