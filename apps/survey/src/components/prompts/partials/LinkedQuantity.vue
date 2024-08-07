<template>
  <v-expansion-panel v-bind="$attrs">
    <v-expansion-panel-header>
      <i18n path="prompts.linkedAmount.label">
        <template #unit>
          {{ linkedQuantityUnit }}
        </template>
        <template #food>
          <span class="font-weight-medium">{{ foodName }}</span>
        </template>
        <template #quantity>
          <span class="font-weight-medium">{{ parentQuantity }}</span>
        </template>
      </i18n>
      <template #actions>
        <expansion-panel-actions :valid="confirm" />
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <quantity-card
        :confirm="confirm"
        :max="parentQuantity"
        :show-all="!!linkedParent.categories.length"
        :value="value"
        @input="updateQuantity"
        @update:confirm="updateConfirm"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { EncodedFood, MissingFood } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { ExpansionPanelActions } from '@intake24/survey/components/elements';
import { useFoodUtils } from '@intake24/survey/composables';

import QuantityCard from './QuantityCard.vue';
import { useStandardUnits } from './use-standard-units';

export type LinkedParent = {
  auto: boolean;
  categories: Prompts['guide-image-prompt']['linkedQuantity']['parent'];
  food: EncodedFood;
};

export default defineComponent({
  name: 'LinkedQuantity',

  components: { ExpansionPanelActions, QuantityCard },

  props: {
    confirm: {
      type: Boolean,
      required: true,
    },
    food: {
      type: Object as PropType<EncodedFood | MissingFood>,
      required: true,
    },
    linkedParent: {
      type: Object as PropType<LinkedParent>,
      required: true,
    },
    prompt: {
      type: Object as PropType<Prompt>,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },

  emits: ['input', 'update:confirm'],

  setup(props, { emit }) {
    const { foodName } = useFoodUtils(props);
    const { i18n, translate } = useI18n();
    const { standardUnitRefs, resolveStandardUnits } = useStandardUnits();

    const linkedQuantityUnit = computed(() => {
      const unit = props.linkedParent.categories[0]?.unit;
      if (!unit || !standardUnitRefs.value[unit])
        return i18n.t('prompts.linkedAmount.unit');

      return translate(standardUnitRefs.value[unit].howMany, {
        path: 'prompts.linkedAmount.unit',
      });
    });

    const parentQuantity = computed(() =>
      props.linkedParent.food?.portionSize?.method === 'guide-image'
        ? props.linkedParent.food.portionSize.quantity
        : 1,
    );

    const updateQuantity = (value: number) => {
      emit('input', value);
    };

    const updateConfirm = (value: boolean) => {
      emit('update:confirm', value);
    };

    onMounted(async () => {
      if (!props.linkedParent.categories.length)
        return;

      const names = props.linkedParent.categories.map(({ unit }) => unit).filter(Boolean) as string[];
      await resolveStandardUnits(names);
    });

    return {
      foodName,
      parentQuantity,
      linkedQuantityUnit,
      updateQuantity,
      updateConfirm,
    };
  },
});
</script>

<style lang="scss" scoped></style>
