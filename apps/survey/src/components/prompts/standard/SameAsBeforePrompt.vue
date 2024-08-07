<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2 d-flex">
      <v-card flat outlined width="100%">
        <v-list class="px-4" color="grey lighten-4">
          <v-subheader>{{ translate(sabFood.food.data.localName) }}</v-subheader>
          <v-divider />
          <v-list-item class="pl-0" dense>
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ promptI18n.serving }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="showLeftovers" class="pl-0" dense>
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ promptI18n.leftovers }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="!linkedFoods.length" class="pl-0" dense>
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ promptI18n.noAddedFoods }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list v-if="linkedFoods.length" class="px-4" color="grey lighten-4">
          <v-subheader>{{ promptI18n.hadWith }}</v-subheader>
          <v-divider />
          <v-list-item v-for="linkedFood in linkedFoods" :key="linkedFood.id" class="pl-0" dense>
            <v-list-item-avatar class="my-auto mr-2">
              <v-icon>fas fa-caret-right</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ linkedFood.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-card-text>
    <template #actions>
      <v-btn
        class="px-4"
        color="primary"
        large
        text
        :title="promptI18n.notSame"
        @click.stop="action('notSame')"
      >
        <v-icon left>
          $no
        </v-icon>
        {{ promptI18n.notSame }}
      </v-btn>
      <v-btn
        class="px-4"
        color="primary"
        large
        text
        :title="promptI18n.same"
        @click.stop="action('same')"
      >
        <v-icon left>
          $yes
        </v-icon>
        {{ promptI18n.same }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn color="primary" text :title="$t('common.action.no')" @click.stop="action('notSame')">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.no') }}
        </span>
        <v-icon class="pb-1">
          $no
        </v-icon>
      </v-btn>
      <v-divider vertical />
      <v-btn color="primary" text title="$t('common.action.yes')" @click.stop="action('same')">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.yes') }}
        </span>
        <v-icon class="pb-1">
          $yes
        </v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';
import { type SameAsBeforeItem, useSurvey } from '@intake24/survey/stores';

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

  setup(props, ctx) {
    const { translate, i18n } = useI18n();
    const { action, translatePrompt, type } = usePromptUtils(props, ctx);
    const { standardUnitRefs, resolveStandardUnits } = useStandardUnits();
    const survey = useSurvey();

    const isDrink = computed(() => props.sabFood.food.data.categories.includes('DRNK'));
    const isValid = true;

    const foodAmount = (food: EncodedFood) => {
      if (food.portionSize?.method === 'milk-in-a-hot-drink')
        return (food.portionSize?.milkVolumePercentage ?? 0) * 100;

      if (food.portionSize?.method === 'standard-portion')
        return food.portionSize?.quantity;

      const servingWeight = food.portionSize?.servingWeight ?? 0;
      const linkedServingWeight
        = (
          food.linkedFoods.find(
            linkedFood =>
              linkedFood.type === 'encoded-food'
              && linkedFood.portionSize?.method === 'milk-in-a-hot-drink',
          ) as EncodedFood | undefined
        )?.portionSize?.servingWeight ?? 0;

      return Math.round(servingWeight + linkedServingWeight);
    };

    const foodUnit = (food: EncodedFood) => {
      if (food.portionSize?.method === 'drink-scale')
        return 'ml';
      if (food.portionSize?.method === 'milk-in-a-hot-drink')
        return '%';

      if (food.portionSize?.method === 'standard-portion' && food.portionSize?.unit) {
        const unit = standardUnitRefs.value[food.portionSize.unit.name]?.estimateIn;
        if (unit)
          return translate(unit);
      }

      return 'g';
    };

    const linkedFoods = computed(() =>
      props.sabFood.food.linkedFoods.map((food) => {
        const { id } = food;
        if (food.type === 'free-text')
          return { id, text: food.description };
        if (food.type === 'missing-food')
          return { id, text: food.info?.name ?? food.searchTerm };
        if (food.type === 'recipe-builder')
          return { id, text: food.template.name ?? food.searchTerm };

        const amount = Math.round(foodAmount(food));
        const unit = foodUnit(food);
        return { id, text: `${translate(food.data.localName)} (${amount} ${unit})` };
      }),
    );

    const serving = computed(() => {
      const amount = foodAmount(props.sabFood.food);
      const unit = foodUnit(props.sabFood.food);

      return i18n.t(`prompts.${type.value}.serving`, { amount: `${amount} ${unit}` });
    });

    const leftovers = computed(() => {
      const { leftoversWeight, servingWeight } = props.sabFood.food.portionSize ?? {};
      if (!servingWeight || !leftoversWeight)
        return i18n.t(`prompts.${type.value}.noLeftovers.${isDrink.value ? 'drink' : 'food'}`);

      const leftoversPercentage = Math.round(leftoversWeight / (servingWeight / 100));

      return i18n.t(`prompts.${type.value}.leftovers`, { amount: `${leftoversPercentage}%` });
    });

    const leftoversEnabled = computed(() => {
      const prompt: Prompt | undefined = survey.foodPrompts.find((item: Prompt) => item.component === `${props.sabFood.food.portionSize?.method}-prompt`);
      return prompt && 'leftovers' in prompt && prompt.leftovers;
    });

    const showLeftovers = computed(() => leftoversEnabled.value || !!props.sabFood.food.portionSize?.leftoversWeight);

    const promptI18n = computed(() => ({
      serving: serving.value,
      leftovers: leftovers.value,
      ...translatePrompt(['hadWith', 'noAddedFoods', 'same', 'notSame']),
    }));

    onMounted(async () => {
      const names = [props.sabFood.food, ...props.sabFood.food.linkedFoods].reduce<string[]>(
        (acc, food) => {
          if (
            food.type !== 'encoded-food'
            || !food.portionSize
            || food.portionSize?.method !== 'standard-portion'
            || !food.portionSize.unit
          ) {
            return acc;
          }

          acc.push(food.portionSize.unit.name);
          return acc;
        },
        [],
      );

      await resolveStandardUnits(names);
    });

    return {
      action,
      isValid,
      linkedFoods,
      promptI18n,
      showLeftovers,
      translate,
    };
  },
});
</script>

<style lang="scss" scoped></style>
