import orderBy from 'lodash/orderBy';

import { actionTypes as actionTypeRefs, actionVariants as actionVariantRefs, type ConditionOpCode, conditionOpCodes, promptLayouts } from '@intake24/common/prompts';
import { recordVisibilities } from '@intake24/common/security';
import { recallFlows as recallFlowRefs, schemeTypes as schemeTypeRefs } from '@intake24/common/surveys';
import { colors as themeColors } from '@intake24/common/theme';
import { textDirections as textDirectionRefs } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';

import { opToIconMap } from './op-icon-map';

export function useSelects() {
  const { i18n: { messages, locale, t } } = useI18n();

  const actions = actionTypeRefs.map(value => ({
    value,
    title: t(`survey-schemes.actions.types.${value}`),
  }));

  const actionVariants = actionVariantRefs.map(value => ({
    value,
    title: t(`survey-schemes.actions.variants.${value}`),
  }));

  const colors = Object.entries(themeColors).map(([key, color]) => ({
    value: key,
    title: key.toUpperCase(),
    color,
  }));

  const conditionOps: { icon: string; op: ConditionOpCode; title: string }[] = conditionOpCodes.map(op => ({
    icon: opToIconMap[op],
    op,
    title: t(`survey-schemes.conditions.ops.${op}`),
  }));

  const flags = orderBy(
    Object.entries(messages.value[locale.value].flags).map(([key, value]) => ({
      value: key,
      title: value,
    })),
    'title',
  );

  const layouts = promptLayouts.map(value => ({
    value,
    title: t(`survey-schemes.actions.layouts.${value}`),
  }));

  const orientations = ['column', 'row'].map(value => ({
    title: t(`survey-schemes.prompts.orientation.${value}`),
    value,
  }));

  const textDirections = textDirectionRefs.map(value => ({
    value,
    title: t(`languages.textDirections.${value}`),
    icon: value === 'ltr' ? 'fas fa-right-long' : 'fas fa-left-long',
  }));

  const visibilities = recordVisibilities.map(value => ({
    value,
    title: t(`securables.visibility.${value}`),
    icon: value === 'restricted' ? 'fas fa-eye-slash' : 'fas fa-eye',
  }));

  const schemeTypes = schemeTypeRefs.map(value => ({
    value,
    title: t(`survey-schemes.settings.types.${value}`),
  }));

  const recallFlows = recallFlowRefs.map(value => ({
    value,
    title: t(`survey-schemes.settings.flows.${value}`),
  }));

  return {
    actions,
    actionVariants,
    colors,
    conditionOps,
    flags,
    layouts,
    orientations,
    textDirections,
    visibilities,
    recallFlows,
    schemeTypes,
  };
}
