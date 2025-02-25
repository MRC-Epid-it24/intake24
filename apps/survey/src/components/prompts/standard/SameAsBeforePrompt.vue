<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2 d-flex">
      <v-card border flat width="100%">
        <v-list class="px-4" color="grey-lighten-4">
          <v-list-subheader>{{ translate(sabFood.food.data.localName) }}</v-list-subheader>
          <v-divider />
          <v-list-item class="ps-0" density="compact">
            <template #prepend>
              <v-icon icon="fas fa-caret-right" />
            </template>
            <v-list-item-title>{{ promptI18n.serving }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="showLeftovers" class="ps-0" density="compact">
            <template #prepend>
              <v-icon icon="fas fa-caret-right" />
            </template>
            <v-list-item-title>{{ promptI18n.leftovers }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!linkedFoods.length" class="ps-0" density="compact">
            <template #prepend>
              <v-icon icon="fas fa-caret-right" />
            </template>
            <v-list-item-title>{{ promptI18n.noAddedFoods }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="count > 1" class="ps-0" density="compact">
            <template #prepend>
              <v-icon icon="fas fa-caret-right" />
            </template>
            <v-list-item-title>{{ promptI18n.count }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-list v-if="linkedFoods.length" class="px-4" color="grey-lighten-4">
          <v-list-subheader>{{ promptI18n.hadWith }}</v-list-subheader>
          <v-divider />
          <v-list-item v-for="linkedFood in linkedFoods" :key="linkedFood.id" class="ps-0" density="compact">
            <template #prepend>
              <v-icon icon="fas fa-caret-right" />
            </template>
            <v-list-item-title>{{ linkedFood.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-card-text>
    <template #actions>
      <v-btn
        class="px-4"
        color="primary"
        size="large"
        :title="promptI18n.notSame"
        variant="text"
        @click.stop="action('notSame')"
      >
        <v-icon icon="$no" start />
        {{ promptI18n.notSame }}
      </v-btn>
      <v-btn
        class="px-4"
        color="primary"
        size="large"
        :title="promptI18n.same"
        variant="text"
        @click.stop="action('same')"
      >
        <v-icon icon="$yes" start />
        {{ promptI18n.same }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn color="primary" :title="$t('common.action.no')" variant="text" @click.stop="action('notSame')">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.no') }}
        </span>
        <v-icon class="pb-1" icon="$no" />
      </v-btn>
      <v-divider vertical />
      <v-btn color="primary" title="$t('common.action.yes')" variant="text" @click.stop="action('same')">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.yes') }}
        </span>
        <v-icon class="pb-1" icon="$yes" />
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import type { Prompt } from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/surveys';
import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';
import { useSurvey } from '@intake24/survey/stores';
import type { SameAsBeforeItem } from '@intake24/survey/stores';
import { CardLayout } from '../layouts';
import { useStandardUnits } from '../partials';
import { createBasePromptProps } from '../prompt-props';

defineOptions({ name: 'SameAsBeforePrompt' });

const props = defineProps({
  ...createBasePromptProps<'same-as-before-prompt'>(),
  sabFood: {
    type: Object as PropType<SameAsBeforeItem>,
    required: true,
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { i18n: { t }, translate } = useI18n();
const { action, translatePrompt, type } = usePromptUtils(props, { emit });
const { standardUnitRefs, resolveStandardUnits } = useStandardUnits();
const survey = useSurvey();

const isDrink = computed(() => props.sabFood.food.data.categories.includes('DRNK'));
const isValid = true;

const foodCount = (food: EncodedFood) => food.portionSize?.method === 'drink-scale' ? food.portionSize.count : 1;

function foodAmount(food: EncodedFood) {
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

  return Math.round((servingWeight + linkedServingWeight) / foodCount(food));
}

function foodUnit(food: EncodedFood) {
  switch (food.portionSize?.method) {
    case 'drink-scale':
      return 'ml';
    case 'milk-in-a-hot-drink':
      return '%';
    case 'standard-portion':
      if (food.portionSize.unit) {
        if (food.portionSize.unit.inlineEstimateIn)
          return food.portionSize.unit.inlineEstimateIn;

        const unit = standardUnitRefs.value[food.portionSize.unit.name]?.estimateIn;
        if (unit)
          return translate(unit);
      }
  }

  return 'g';
}

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

const count = computed(() => foodCount(props.sabFood.food));
const servingCount = computed(() => t(`prompts.${type.value}.count`, { count: foodCount(props.sabFood.food) }));

const serving = computed(() => {
  const amount = foodAmount(props.sabFood.food);
  const unit = foodUnit(props.sabFood.food);

  return t(`prompts.${type.value}.serving`, { amount: `${amount} ${unit}` });
});

const leftovers = computed(() => {
  const { leftoversWeight, servingWeight } = props.sabFood.food.portionSize ?? {};
  if (!servingWeight || !leftoversWeight)
    return t(`prompts.${type.value}.noLeftovers.${isDrink.value ? 'drink' : 'food'}`);

  const leftoversPercentage = Math.round(leftoversWeight / (servingWeight / 100));

  return t(`prompts.${type.value}.leftovers`, { amount: `${leftoversPercentage}%` });
});

const leftoversEnabled = computed(() => {
  const prompt: Prompt | undefined = survey.foodPrompts.find((item: Prompt) => item.component === `${props.sabFood.food.portionSize?.method}-prompt`);
  return prompt && 'leftovers' in prompt && prompt.leftovers;
});

const showLeftovers = computed(() => leftoversEnabled.value || !!props.sabFood.food.portionSize?.leftoversWeight);

const promptI18n = computed(() => ({
  serving: serving.value,
  leftovers: leftovers.value,
  count: servingCount.value,
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
</script>

<style lang="scss" scoped></style>
