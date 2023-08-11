<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-card-text class="pt-2 d-flex">
      <v-card flat outlined width="100%">
        <v-list class="px-4" color="grey lighten-4">
          <v-subheader>{{ translate(sabFood.food.data.localName) }}</v-subheader>
          <v-divider></v-divider>
          <v-list-item class="pl-0" dense>
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ i18n.serving }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="pl-0" dense>
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ i18n.leftovers }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="!sabFood.food.linkedFoods.length" class="pl-0" dense>
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ i18n.noAddedFoods }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list v-if="sabFood.food.linkedFoods.length" class="px-4" color="grey lighten-4">
          <v-subheader>{{ i18n.hadWith }}</v-subheader>
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
        class="px-4"
        color="secondary"
        large
        text
        :title="i18n.notSame"
        @click.stop="action('notSame')"
      >
        <v-icon left>$no</v-icon>
        {{ i18n.notSame }}
      </v-btn>
      <v-btn
        class="px-4"
        color="secondary"
        large
        text
        :title="i18n.same"
        @click.stop="action('same')"
      >
        <v-icon left>$yes</v-icon>
        {{ i18n.same }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :title="$t('common.action.no')" value="notSame" @click.stop="action('notSame')">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.no') }}
        </span>
        <v-icon class="pb-1">$no</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn :title="$t('common.action.yes')" value="same" @click.stop="action('same')">
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
import { computed, defineComponent, onMounted } from 'vue';

import type { EncodedFood, FoodState } from '@intake24/common/types';
import type { SameAsBeforeItem } from '@intake24/survey/stores';
import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';
import { useStandardUnits } from '../partials';

export default defineComponent({
  name: 'SameAsBeforePrompt',

  mixins: [createBasePrompt<'same-as-before-prompt'>()],

  props: {
    sabFood: {
      type: Object as PropType<SameAsBeforeItem>,
      required: true,
    },
  },

  setup(props) {
    const { translate } = useI18n();
    const { translatePrompt, type } = usePromptUtils(props);
    const { standardUnitRefs, fetchStandardUnits } = useStandardUnits();

    const isDrink = computed(() => props.sabFood.food.data.categories.includes('DRNK'));

    const foodAmount = (food: EncodedFood) => {
      if (food.portionSize?.method === 'milk-in-a-hot-drink')
        return (food.portionSize?.milkVolumePercentage ?? 0) * 100;

      if (food.portionSize?.method === 'standard-portion') return food.portionSize?.quantity;

      return Math.round(food.portionSize?.servingWeight ?? 0);
    };

    const foodUnit = (food: EncodedFood) => {
      if (food.portionSize?.method === 'drink-scale') return 'ml';
      if (food.portionSize?.method === 'milk-in-a-hot-drink') return '%';

      if (food.portionSize?.method === 'standard-portion' && food.portionSize?.unit) {
        const unit = standardUnitRefs.value[food.portionSize.unit.name]?.estimateIn;
        if (unit) return translate(unit);
      }

      return 'g';
    };

    const linkedFoodInfo = (food: FoodState) => {
      if (food.type === 'free-text') return food.description;
      if (food.type === 'missing-food') return food.info?.name ?? food.searchTerm;

      const amount = Math.round(foodAmount(food));
      const unit = foodUnit(food);
      return `${translate(food.data.localName)} (${amount} ${unit})`;
    };

    const serving = computed(() => {
      const amount = foodAmount(props.sabFood.food);
      const unit = foodUnit(props.sabFood.food);

      return translate(props.prompt.i18n.serving, {
        path: `prompts.${type.value}.serving`,
        params: { amount: `${amount} ${unit}` },
      });
    });

    const leftovers = computed(() => {
      const {
        prompt: { i18n },
      } = props;

      const { leftoversWeight, servingWeight } = props.sabFood.food.portionSize ?? {};
      if (!servingWeight || !leftoversWeight)
        return translate(isDrink.value ? i18n['noLeftovers.drink'] : i18n['noLeftovers.food'], {
          path: `prompts.${type.value}.noLeftovers.${isDrink.value ? 'drink' : 'food'}`,
        });

      const leftoversPercentage = Math.round(leftoversWeight / (servingWeight / 100));

      return translate(i18n.leftovers, {
        path: `prompts.${type.value}.leftovers`,
        params: { amount: `${leftoversPercentage}%` },
      });
    });

    const i18n = computed(() => ({
      serving: serving.value,
      leftovers: leftovers.value,
      ...translatePrompt(['hadWith', 'noAddedFoods', 'same', 'notSame']),
    }));

    const isValid = computed(() => true);

    onMounted(async () => {
      const names = [props.sabFood.food, ...props.sabFood.food.linkedFoods].reduce<string[]>(
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

      await fetchStandardUnits(names);
    });

    return {
      i18n,
      isValid,
      linkedFoodInfo,
      translate,
    };
  },
});
</script>

<style lang="scss" scoped></style>
