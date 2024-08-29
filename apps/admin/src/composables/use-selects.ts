import orderBy from 'lodash/orderBy';

import { actionTypes as actionTypeRefs, actionVariants as actionVariantRefs, promptLayouts } from '@intake24/common/prompts';
import { recordVisibilities } from '@intake24/common/security';
import { recallFlows as recallFlowRefs, schemeTypes as schemeTypeRefs } from '@intake24/common/surveys';
import { colors as themeColors } from '@intake24/common/theme';
import { textDirections as textDirectionRefs } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';

export function useSelects() {
  const { i18n } = useI18n();

  const actions = actionTypeRefs.map(value => ({
    value,
    text: i18n.t(`survey-schemes.actions.types.${value}`).toString(),
  }));

  const actionVariants = actionVariantRefs.map(value => ({
    value,
    text: i18n.t(`survey-schemes.actions.variants.${value}`).toString(),
  }));

  const colors = Object.entries(themeColors).map(([key, color]) => ({
    value: key,
    text: key.toUpperCase(),
    color,
  }));

  const flags = orderBy(
    Object.entries(i18n.messages[i18n.locale].flags).map(([key, value]) => ({
      value: key,
      text: value,
    })),
    'text',
  );

  const layouts = promptLayouts.map(value => ({
    value,
    text: i18n.t(`survey-schemes.actions.layouts.${value}`).toString(),
  }));

  const orientations = ['column', 'row'].map(value => ({
    text: i18n.t(`survey-schemes.prompts.orientation.${value}`),
    value,
  }));

  const textDirections = textDirectionRefs.map(value => ({
    value,
    text: i18n.t(`languages.textDirections.${value}`).toString(),
    icon: value === 'ltr' ? 'fas fa-right-long' : 'fas fa-left-long',
  }));

  const visibilities = recordVisibilities.map(value => ({
    value,
    text: i18n.t(`securables.visibility.${value}`).toString(),
    icon: value === 'restricted' ? 'fas fa-eye-slash' : 'fas fa-eye',
  }));

  const schemeTypes = schemeTypeRefs.map(value => ({
    value,
    text: i18n.t(`survey-schemes.settings.types.${value}`),
  }));

  const recallFlows = recallFlowRefs.map(value => ({
    value,
    text: i18n.t(`survey-schemes.settings.flows.${value}`),
  }));

  return {
    actions,
    actionVariants,
    colors,
    flags,
    layouts,
    orientations,
    textDirections,
    visibilities,
    recallFlows,
    schemeTypes,
  };
}
