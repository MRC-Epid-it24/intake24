import orderBy from 'lodash/orderBy';
import { computed } from 'vue';

import { actionTypes, actionVariants, promptLayouts } from '@intake24/common/prompts';
import { recordVisibilities } from '@intake24/common/security';
import { colors as themeColors } from '@intake24/common/theme';
import { textDirections } from '@intake24/common/types';
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

  const colors = computed(() =>
    Object.entries(themeColors).map(([key, color]) => ({
      value: key,
      text: key.toUpperCase(),
      color,
    }))
  );

  const flags = computed(() =>
    orderBy(
      Object.entries(i18n.messages[i18n.locale].flags).map(([key, value]) => ({
        value: key,
        text: value,
      })),
      'text'
    )
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

  const properties = computed(() =>
    ['recallNumber', 'userName'].map((value) => ({
      value,
      text: i18n.t(`survey-schemes.conditions.properties.${value}`).toString(),
    }))
  );

  const sections = computed(() =>
    ['food', 'meal', 'survey'].map((value) => ({
      value,
      text: i18n.t(`survey-schemes.conditions.sections.${value}`).toString(),
    }))
  );

  const textDirectionList = computed(() =>
    textDirections.map((value) => ({
      value,
      text: i18n.t(`languages.textDirections.${value}`).toString(),
      icon: value === 'ltr' ? 'fas fa-right-long' : 'fas fa-left-long',
    }))
  );

  const visibilityList = computed(() =>
    recordVisibilities.map((value) => ({
      value,
      text: i18n.t(`securables.visibility.${value}`).toString(),
      icon: value === 'restricted' ? 'fas fa-eye-slash' : 'fas fa-eye',
    }))
  );

  return {
    actionList,
    actionVariantsList,
    colors,
    flags,
    layoutList,
    orientations,
    properties,
    sections,
    textDirectionList,
    visibilityList,
  };
};
