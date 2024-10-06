<template>
  <component :is="customPromptLayout" v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card dense flat>
      <v-list v-model:opened="opened" density="compact">
        <v-list-group v-for="meal in filteredMeals" :key="meal.id" :value="meal.id">
          <template #activator="{ props }">
            <v-list-item class="text-primary">
              <v-list-item-title class="font-weight-bold text-wrap" v-bind="props">
                {{ meal.name[$i18n.locale] }}
              </v-list-item-title>
              <template #append>
                <v-list-item-action>
                  <span v-if="meal.time">
                    {{ stringTime(meal.time) }}
                  </span>
                  <v-icon v-else size="x-small">
                    $question
                  </v-icon>
                </v-list-item-action>
              </template>
            </v-list-item>
          </template>
          <v-list-item :style="{ 'padding-inline-start': '0 !important' }">
            <v-container :class="{ 'pa-2': $vuetify.display.mobile }">
              <div v-if="localeOptions.length <= 3">
                <v-row class="mb-4" style="flex-wrap: nowrap">
                  <v-col cols="3" />
                  <v-col v-for="(option, index) in localeOptions" :key="index" class="ps-0" cols="3">
                    <label class="option-label">{{ option.label }}</label>
                  </v-col>
                </v-row>
                <v-radio-group
                  v-for="food in meal.foods" :key="food.id" v-model="promptAnswers[food.id]" class="mb-0 mt-0" density="compact" inline
                  @update:model-value="updatePromptAnswers()"
                >
                  <v-col class="pa-0 pe-3 ma-0" cols="3">
                    <span class="food-label">{{ foodDisplayName(food) }}</span>
                  </v-col>

                  <v-col v-for="(option, optIndex) in localeOptions" :key="optIndex" class="pa-0 ma-0" cols="3">
                    <v-radio :value="option.value" />
                  </v-col>
                </v-radio-group>
              </div>
              <div v-else>
                <v-row
                  v-for="food in meal.foods" :key="food.id" v-model="promptAnswers[food.id]" align="baseline"
                  class="mb-0 mt-0" dense row style="flex-wrap: nowrap"
                >
                  <v-col class="pa-0 pe-4 ma-0 ms-2" cols="4">
                    <span class="food-label">{{ foodDisplayName(food) }}</span>
                  </v-col>
                  <v-col class="pa-0 ma-0">
                    <v-select
                      v-model="promptAnswers[food.id]"
                      class="option-label" cols="8" item-title="label" item-value="value" :items="localeOptions" md="6"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-container>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { CustomPromptAnswer, FoodState, MealState, MealTime } from '@intake24/common/types';
import { fromMealTime } from '@intake24/common/surveys';
import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../../createBasePrompt';

const maxRadioButtonsDesktop = 4;
const maxRadioButtonsMobile = 3;

export default defineComponent({
  name: 'AggregateChoicePrompt',

  mixins: [createBasePrompt<'aggregate-choice-prompt'>()],

  props: {
    modelValue: {
      type: Object as PropType<Record<string, CustomPromptAnswer>>,
      required: true,
    },
    filteredMeals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { i18n: { locale } } = useI18n();

    const localeOptions = computed(
      () => props.prompt.options[locale.value] ?? props.prompt.options.en,
    );

    const opened = ref(props.filteredMeals.map(meal => meal.id));

    const promptAnswers = ref(props.modelValue);

    const { action, customPromptLayout, errors, hasErrors, type } = usePromptUtils(
      props,
      ctx,
    );

    const foodDisplayName = (food: FoodState) => {
      let dispalyName = '???';
      if (food.type === 'free-text')
        dispalyName = food.description;
      if (food.type === 'encoded-food')
        dispalyName = food.data.localName;
      return dispalyName;
    };

    const stringTime = (time: MealTime) => {
      return fromMealTime(time);
    };

    const isValid = computed(() => {
      return props.filteredMeals.every(meal => meal.foods.every(food => props.modelValue[food.id] !== undefined));
    });

    const updatePromptAnswers = () => {
      ctx.emit('update:modelValue', promptAnswers.value);
    };

    return {
      action,
      customPromptLayout,
      errors,
      hasErrors,
      localeOptions,
      type,
      foodDisplayName,
      opened,
      stringTime,
      isValid,
      promptAnswers,
      updatePromptAnswers,
      maxRadioButtonsDesktop,
      maxRadioButtonsMobile,
    };
  },
});
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .option-label {
    font-size: smaller;
  }
  .food-label {
    font-size: smaller;
  }
}
</style>
