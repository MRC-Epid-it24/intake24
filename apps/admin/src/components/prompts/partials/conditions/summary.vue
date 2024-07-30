<template>
  <code class="pa-5 d-flex align-baseline">
    <v-label class="mr-2">{{ $t(`survey-schemes.conditions.showIf`) }}</v-label>
    <v-label v-dompurify-html:i18n="summaryHtml" />

    <div v-if="showOp">
      <v-icon left right small>{{ opToIconMap[check.op] }}</v-icon>
      <v-label class="align-baseline">{{ check.value || '?' }}</v-label>
      <v-label
        v-if="showNotRequired" v-dompurify-html:i18n="$t(`survey-schemes.conditions.summary.notRequired`)" class="ml-2 align-baseline"
      />
    </div>
  </code>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, toRefs, watch } from 'vue';

import type {
  Condition,
  PromptAnswerPropertyCheck,
} from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

import opToIconMap from './op-icon-map';

export default defineComponent({
  name: 'ConditionSummary',

  props: {
    condition: {
      type: Object as PropType<Condition>,
      required: true,
    },
  },

  setup(props) {
    const { i18n } = useI18n();
    const getSummaryHtml = (condition: Condition): string => {
      const object = i18n.t(`survey-schemes.conditions.object.${condition.object}`).toString().toLocaleLowerCase();
      const property = i18n.t(`survey-schemes.conditions.property.${condition.property.id}`).toString().toLocaleLowerCase();

      switch (condition.property.type) {
        case 'flag': {
          return condition.property.check.value
            ? i18n.t(`survey-schemes.conditions.summary.flag.set`, { id: condition.property.check.flagId || '?', object }).toString()
            : i18n.t(`survey-schemes.conditions.summary.flag.notSet`, { id: condition.property.check.flagId || '?', object }).toString();
        }
        case 'tag': {
          return condition.property.check.value
            ? i18n.t(`survey-schemes.conditions.summary.tag.present`, { id: condition.property.check.tagId || '?', object }).toString()
            : i18n.t(`survey-schemes.conditions.summary.tag.absent`, { id: condition.property.check.tagId || '?', object }).toString();
        }
        case 'boolean': {
          const value = (condition.property.check.value ? i18n.t(`common.yes`) : i18n.t(`common.no`)).toString().toLocaleLowerCase();
          return i18n.t(`survey-schemes.conditions.summary.boolean`, { object, property, value }).toString();
        }
        case 'value':
          return i18n.t(`survey-schemes.conditions.summary.value`, { object, property }).toString();
        case 'promptAnswer':
          return i18n.t(`survey-schemes.conditions.summary.promptAnswer`, { object, property, promptId: condition.property.check.promptId || '?' }).toString();
        case 'mealCompletion':
          return i18n.t(`survey-schemes.conditions.summary.mealCompletion.${condition.property.check.completionState}`, { object }).toString();
        case 'foodCompletion':
          return i18n.t(`survey-schemes.conditions.summary.foodCompletion.${condition.property.check.completionState}`, { object }).toString();
        default:
          throw new Error(`Unexpected condition property type: ${condition.property.type}`);
      }
    };

    const getShowOp = (condition: Condition): boolean => {
      switch (condition.property.type) {
        case 'value':
        case 'promptAnswer':
          return true;
        default:
          return false;
      }
    };

    const getShowNotRequired = (condition: Condition): boolean => {
      switch (condition.property.type) {
        case 'promptAnswer':
          return !condition.property.check.required;
        default:
          return false;
      }
    };

    const conditionRef = toRefs(props).condition;

    const summaryHtml = ref(getSummaryHtml(props.condition));
    const showOp = ref(getShowOp(props.condition));
    const showNotRequired = ref(getShowNotRequired(props.condition));
    const check = ref(props.condition.property.check as PromptAnswerPropertyCheck);

    watch (conditionRef, (condition) => {
      summaryHtml.value = getSummaryHtml(condition);
      showOp.value = getShowOp(condition);
      showNotRequired.value = getShowNotRequired(condition);
      check.value = condition.property.check as PromptAnswerPropertyCheck;
    }, { deep: true });

    return { summaryHtml, showOp, showNotRequired, check, opToIconMap };
  },
});
</script>

<style lang="scss" scoped />
