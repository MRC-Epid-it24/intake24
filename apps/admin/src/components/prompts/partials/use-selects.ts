import { computed } from 'vue';

import { actionTypes, actionVariants, promptLayouts } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

export const useSelects = () => {
  const { i18n } = useI18n();

  const actionList = computed(() =>
    actionTypes.map((value) => ({
      value,
      text: i18n.t(`survey-schemes.actions.types.${value}`).toString(),
    }))
  );

  const actionVariantsList = computed(() =>
    actionVariants.map((value) => ({
      value,
      text: i18n.t(`survey-schemes.actions.variants.${value}`).toString(),
    }))
  );

  const layoutList = computed(() =>
    promptLayouts.map((value) => ({
      value,
      text: i18n.t(`survey-schemes.actions.layouts.${value}`).toString(),
    }))
  );

  const orientations = computed(() =>
    ['column', 'row'].map((value) => ({
      text: i18n.t(`survey-schemes.prompts.orientation.${value}`),
      value,
    }))
  );
  const sections = computed(() =>
    ['food', 'meal', 'survey'].map((value) => ({
      value,
      text: i18n.t(`survey-schemes.conditions.sections.${value}`).toString(),
    }))
  );

  return { actionList, actionVariantsList, layoutList, orientations, sections };
};
