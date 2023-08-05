<template>
  <v-expansion-panel v-bind="$attrs">
    <v-expansion-panel-header>
      <i18n path="prompts.linkedAmount.label">
        <template #unit>{{ linkedQuantityUnit }}</template>
        <template #food>
          <span class="font-weight-medium">{{ foodName }}</span>
        </template>
        <template #quantity>
          <span class="font-weight-medium">{{ parentQuantity }}</span>
        </template>
      </i18n>
      <template #actions>
        <expansion-panel-actions :valid="confirm"></expansion-panel-actions>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <quantity-card
        :confirm="confirm"
        :max="parentQuantity"
        :show-all="!!linkedQuantityCategories.length"
        :value="value"
        @input="updateQuantity"
        @update:confirm="updateConfirm"
      ></quantity-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onMounted, toRefs } from 'vue';

import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { EncodedFood, MissingFood } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { ExpansionPanelActions } from '@intake24/survey/components/elements';
import { useFoodUtils } from '@intake24/survey/composables';
import { useLocale } from '@intake24/ui';

import QuantityCard from './QuantityCard.vue';
import { useStandardUnits } from './use-standard-units';

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
    linkedQuantityCategories: {
      type: Array as PropType<Prompts['guide-image-prompt']['linkedQuantityCategories']>,
      required: true,
    },
    parentFood: {
      type: Object as PropType<EncodedFood>,
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
    const { food } = toRefs(props);
    const { foodName } = useFoodUtils(food);

    const i18n = useI18n();
    const { getLocaleContent } = useLocale();
    const { standardUnitRefs, fetchStandardUnits } = useStandardUnits();

    const linkedQuantityUnit = computed(() => {
      const unit = props.linkedQuantityCategories[0]?.unit;
      if (!unit || !standardUnitRefs.value[unit]) return i18n.t('prompts.linkedAmount.unit');

      return getLocaleContent(standardUnitRefs.value[unit].howMany, {
        path: 'prompts.linkedAmount.unit',
      });
    });

    const parentQuantity = computed(() =>
      props.parentFood?.portionSize?.method === 'guide-image'
        ? props.parentFood.portionSize.quantity
        : 0
    );

    const updateQuantity = (value: number) => {
      emit('input', value);
    };

    const updateConfirm = (value: boolean) => {
      emit('update:confirm', value);
    };

    onMounted(async () => {
      if (!props.linkedQuantityCategories.length) return;

      const names = props.linkedQuantityCategories.map(({ unit }) => unit).filter(Boolean);
      if (names.length) await fetchStandardUnits(names as string[]);

      if (!props.confirm) updateQuantity(parentQuantity.value);
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
