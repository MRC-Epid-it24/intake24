import { computed } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { EncodedFood, FoodState, PartialRecord } from '@intake24/common/types';
import type { LocaleContentOptions } from '@intake24/i18n';
import { useI18n } from '@intake24/i18n';
import { promptType } from '@intake24/ui';

import type { UseFoodUtilsProps } from './use-food-utils';
import type { UseMealUtilsProps } from './use-meal-utils';
import { useFoodUtils } from './use-food-utils';
import { useMealUtils } from './use-meal-utils';

export type UsePromptPropsBase<P extends keyof Prompts> = {
  prompt: Prompts[P];
};

export type UsePromptProps<
  P extends keyof Prompts,
  F extends FoodState | undefined,
  FP extends EncodedFood | undefined,
> = UsePromptPropsBase<P> & UseFoodUtilsProps<F, FP> & UseMealUtilsProps;

export const usePromptUtils = <
  P extends keyof Prompts,
  F extends FoodState | undefined,
  FP extends EncodedFood | undefined,
>(
  props: UsePromptProps<P, F, FP>
) => {
  const { i18n } = useI18n();
  const { mealName, mealTime } = useMealUtils(props);
  const { foodName } = useFoodUtils(props);

  const type = computed(() => promptType(props.prompt.component));

  const params = computed(() => {
    const build: Record<string, string> = {};

    if (foodName.value) {
      build.item = foodName.value;
      build.food = foodName.value;
    }

    if (mealName.value) {
      build.mealName = mealName.value;

      if (mealTime.value) {
        build.mealTime = mealTime.value;

        const meal = `${mealName.value} (${mealTime.value})`;
        build.item = meal;
        build.meal = meal;
      } else {
        build.item = mealName.value;
        build.meal = mealName.value;
      }
    }

    return build;
  });

  const translatePrompt = <T extends string>(
    keys: T[],
    params: PartialRecord<T, LocaleContentOptions['params']> = {}
  ) => {
    return keys.reduce(
      (acc, key) => {
        acc[key] = i18n.t(`prompts.${type.value}.${key}`, params[key] ?? {}).toString();
        return acc;
      },
      {} as Record<T, string>
    );
  };

  return {
    params,
    translatePrompt,
    type,
  };
};
