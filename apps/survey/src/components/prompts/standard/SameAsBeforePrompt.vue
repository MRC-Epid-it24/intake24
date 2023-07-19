<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-card-text class="pt-2 d-flex">
      <v-card flat outlined width="100%">
        <v-list class="px-4" color="grey lighten-4">
          <v-subheader>{{ getLocaleContent(sabFood.food.data.localName) }}</v-subheader>
          <v-divider></v-divider>
          <v-list-item class="pl-0" dense>
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ serving }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="pl-0" dense>
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ leftovers }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="!sabFood.food.linkedFoods.length" class="pl-0" dense>
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ $t('prompts.sameAsBefore.noAddedFoods') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list v-if="sabFood.food.linkedFoods.length" class="px-4" color="grey lighten-4">
          <v-subheader>{{ $t('prompts.sameAsBefore.hadWith') }}</v-subheader>
          <v-divider></v-divider>
          <v-list-item
            v-for="linkedFood in sabFood.food.linkedFoods"
            :key="linkedFood.id"
            class="pl-0"
            dense
          >
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ linkedFoodInfo(linkedFood) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-card-text>
    <template #actions>
      <v-btn
        :block="isMobile"
        class="px-4"
        color="secondary"
        large
        text
        @click.stop="action('notSame')"
      >
        <v-icon left>$no</v-icon>
        {{ $t(`prompts.${type}.notSame`) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-4"
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        color="secondary"
        large
        text
        @click.stop="action('same')"
      >
        <v-icon left>$yes</v-icon>
        {{ $t(`prompts.${type}.same`) }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn value="notSame" @click.stop="action('notSame')">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.no') }}
        </span>
        <v-icon class="pb-1">$no</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn value="same" @click.stop="action('same')">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.yes') }}
        </span>
        <v-icon class="pb-1">$yes</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { EncodedFood, FoodState } from '@intake24/common/types';
import type { SameAsBeforeItem } from '@intake24/survey/stores';
import { useLocale } from '@intake24/ui';

import createBasePrompt from '../createBasePrompt';
import { useStandardUnits } from '../useStandardUnits';

export default defineComponent({
  name: 'SameAsBeforePrompt',

  mixins: [createBasePrompt<'same-as-before-prompt'>()],

  props: {
    sabFood: {
      type: Object as PropType<SameAsBeforeItem>,
      required: true,
    },
  },

  setup() {
    const { getLocaleContent } = useLocale();
    const { standardUnitRefs, fetchStandardUnits } = useStandardUnits();

    return { standardUnitRefs, fetchStandardUnits, getLocaleContent };
  },

  computed: {
    isDrink() {
      return this.sabFood.food.data.categories.includes('DRNK');
    },
    serving() {
      const amount = this.foodAmount(this.sabFood.food);
      const unit = this.foodUnit(this.sabFood.food);

      return this.$t(`prompts.${this.type}.serving`, { amount: `${amount} ${unit}` });
    },
    leftovers() {
      const { leftoversWeight, servingWeight } = this.sabFood.food.portionSize ?? {};
      if (!servingWeight || !leftoversWeight)
        return this.$t(`prompts.${this.type}.noLeftovers.${this.isDrink ? 'drink' : 'food'}`);

      const leftoversPercentage = Math.round(leftoversWeight / (servingWeight / 100));

      return this.$t(`prompts.${this.type}.leftovers`, { amount: `${leftoversPercentage}%` });
    },
    isValid(): boolean {
      return true;
    },
  },

  async mounted() {
    const names = [this.sabFood.food, ...this.sabFood.food.linkedFoods].reduce<string[]>(
      (acc, food) => {
        if (
          food.type !== 'encoded-food' ||
          !food.portionSize ||
          food.portionSize?.method !== 'standard-portion' ||
          !food.portionSize.unit
        )
          return acc;

        acc.push(food.portionSize.unit.name);
        return acc;
      },
      []
    );

    if (!names.length) return;

    await this.fetchStandardUnits(names);
  },

  methods: {
    linkedFoodInfo(food: FoodState) {
      if (food.type === 'free-text') return food.description;
      if (food.type === 'missing-food') return food.info?.name ?? food.searchTerm;

      const amount = Math.round(this.foodAmount(food));
      const unit = this.foodUnit(food);
      return `${this.getLocaleContent(food.data.localName)} (${amount} ${unit})`;
    },

    foodAmount(food: EncodedFood) {
      if (food.portionSize?.method === 'milk-in-a-hot-drink')
        return (food.portionSize?.milkVolumePercentage ?? 0) * 100;

      if (food.portionSize?.method === 'standard-portion') return food.portionSize?.quantity;

      return Math.round(food.portionSize?.servingWeight ?? 0);
    },

    foodUnit(food: EncodedFood) {
      if (food.portionSize?.method === 'drink-scale') return 'ml';
      if (food.portionSize?.method === 'milk-in-a-hot-drink') return '%';

      if (food.portionSize?.method === 'standard-portion' && food.portionSize?.unit) {
        const unit = this.standardUnitRefs[food.portionSize.unit.name]?.estimateIn;
        if (unit) return this.getLocaleContent(unit);
      }

      return 'g';
    },
  },
});
</script>

<style lang="scss" scoped></style>
