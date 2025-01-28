<template>
  <code class="pa-5 d-flex align-baseline">
    <v-label class="mr-2">{{ $t(`survey-schemes.conditions.showIf`) }}</v-label>
    <v-label v-dompurify-html:i18n="info.summaryHtml" />
    <div v-if="info.showOp">
      <v-icon end size="small" start>{{ info.icon }}</v-icon>
      <v-label class="align-baseline">{{ info.check.value || '?' }}</v-label>
      <v-label
        v-if="info.showNotRequired" v-dompurify-html:i18n="$t(`survey-schemes.conditions.summary.notRequired`)" class="ml-2 align-baseline"
      />
    </div>
  </code>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import { opToIconMap } from '@intake24/admin/composables';
import type {
  Condition,
} from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

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
      const object = i18n.t(`survey-schemes.conditions.object.${condition.object}`).toLocaleLowerCase();
      const property = i18n.t(`survey-schemes.conditions.property.${condition.property.id}`).toLocaleLowerCase();

      switch (condition.property.type) {
        case 'flag': {
          return condition.property.check.value
            ? i18n.t(`survey-schemes.conditions.summary.flag.set`, { id: condition.property.check.flagId || '?', object })
            : i18n.t(`survey-schemes.conditions.summary.flag.notSet`, { id: condition.property.check.flagId || '?', object });
        }
        case 'tag': {
          return condition.property.check.value
            ? i18n.t(`survey-schemes.conditions.summary.tag.present`, { id: condition.property.check.tagId || '?', object })
            : i18n.t(`survey-schemes.conditions.summary.tag.absent`, { id: condition.property.check.tagId || '?', object });
        }
        case 'boolean': {
          const value = (condition.property.check.value ? i18n.t(`common.yes`) : i18n.t(`common.no`)).toLocaleLowerCase();
          return i18n.t(`survey-schemes.conditions.summary.boolean`, { object, property, value });
        }
        case 'value':
          return i18n.t(`survey-schemes.conditions.summary.value`, { object, property });
        case 'entityValue':
          return i18n.t(`survey-schemes.conditions.summary.entityValue`, { object, property });
        case 'promptAnswer':
          return i18n.t(`survey-schemes.conditions.summary.promptAnswer`, { object, property, promptId: condition.property.check.promptId || '?' });
        case 'userField':
          return i18n.t(`survey-schemes.conditions.summary.userField`, { object, property, field: condition.property.check.field || '?' });
        case 'mealCompletion':
          return i18n.t(`survey-schemes.conditions.summary.mealCompletion.${condition.property.check.completionState}`, { object });
        case 'foodCompletion':
          return i18n.t(`survey-schemes.conditions.summary.foodCompletion.${condition.property.check.completionState}`, { object });
        default:
          throw new Error(`Unexpected condition property type: ${condition.property.type}`);
      }
    };

    const getShowOp = (condition: Condition): boolean => {
      switch (condition.property.type) {
        case 'value':
        case 'promptAnswer':
        case 'userField':
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

    const info = computed(() => {
      const check = props.condition.property.check;

      return {
        summaryHtml: getSummaryHtml(props.condition),
        showOp: getShowOp(props.condition),
        showNotRequired: getShowNotRequired(props.condition),
        check,
        icon: 'op' in check ? opToIconMap[check.op] : undefined,
      };
    });

    return { info };
  },
});
</script>

<style lang="scss" scoped />
