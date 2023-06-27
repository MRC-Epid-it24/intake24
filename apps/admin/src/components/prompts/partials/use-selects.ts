import { computed } from 'vue';

import { actionTypes, promptLayouts } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

export const useSelects = () => {
  const i18n = useI18n();

  const actionList = computed(() =>
    actionTypes.map((type) => ({
      type,
      text: i18n.t(`survey-schemes.actions.types.${type}`).toString(),
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
      text: i18n.t(`survey-schemes.questions.orientation.${value}`),
      value,
    }))
  );
  const sections = computed(() =>
    ['food', 'meal', 'survey'].map((value) => ({
      value,
      text: i18n.t(`survey-schemes.conditions.sections.${value}`).toString(),
    }))
  );

  return { actionList, layoutList, orientations, sections };
};
