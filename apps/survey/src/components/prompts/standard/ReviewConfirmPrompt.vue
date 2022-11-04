<template>
  <prompt-layout v-bind="{ description, text }">
    <v-col class="px-0 px-sm-3 align-center text-center justify-center" md="8" sm="12">
      <survey-progress-bar :meals="meals"></survey-progress-bar>
      <v-divider></v-divider>
    </v-col>
    <v-col class="px-0 px-sm-3 align-center text-center justify-center" md="8" sm="12">
      <v-card dense flat>
        <v-list class="flex-grow-1 flex-shrink-0" dense>
          <v-list-item v-for="meal in meals" :key="meal.id" :inactive="true" link :ripple="false">
            <v-list-item-icon>
              <v-icon> $meal</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-group :value="meal.time ? true : false">
                <template #activator>
                  <v-list-item-title
                    class="font-weight-bold text-wrap"
                    @click="chooseMeal(meal.id, meal.name.en, meal.foods, 'meal')"
                  >
                    {{ meal.name[$i18n.locale] }}
                  </v-list-item-title>
                  <v-list-item-action>
                    <v-list-item-action-text v-if="meal.time">
                      {{ stringTime(meal.time) }}
                    </v-list-item-action-text>
                    <v-icon v-else x-small>far fa-question-circle </v-icon>
                  </v-list-item-action>
                </template>
                <v-list v-if="meal.foods.length && meal.time ? true : false">
                  <v-list-item v-for="(food, i) in meal.foods" :key="i" link>
                    <v-list-item-title
                      class="text-wrap"
                      @click="chooseFood(food.id, foodDisplayName(food), 'food')"
                    >
                      {{ foodDisplayName(food) }}
                    </v-list-item-title>
                    <v-list-item-action>
                      <v-icon v-if="food.data" color="success" x-small>fa-check</v-icon>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-icon v-if="food.portionSizeMethod" color="success" x-small
                        >fa-check</v-icon
                      >
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-list-group>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <template #actions> </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { FoodState, MealState, MealTime } from '@intake24/common/types';
import { SurveyProgressBar } from '@intake24/survey/components/elements';
import Submit from '@intake24/survey/components/prompts/actions/Submit.vue';
import { useSurvey } from '@intake24/survey/stores';
import { fromMealTime } from '@intake24/survey/stores/meal-food-utils';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'ReviewConfirmPrompt',

  components: { SurveyProgressBar },

  mixins: [BasePrompt, Submit],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    ...mapState(useSurvey, ['defaultSchemeMeals']),

    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      if (text) return text;
      return '';
    },

    description(): string {
      const description = this.promptProps.description[this.$i18n.locale];
      if (description) return description;
      return '';
    },
  },

  methods: {
    submit() {
      this.$emit('submit');
    },
    chooseMeal(mealId: number, name: string, foods: FoodState[], entity: string) {
      this.$emit('meal-selected', { mealId, name, foods, entity });
    },
    chooseFood(foodId: number, name: string, entity: string) {
      this.$emit('food-selected', { foodId, name, entity });
    },
    foodDisplayName(food: FoodState) {
      let dispalyName = '???';
      if (food.type === 'free-text') dispalyName = food.description;
      if (food.type === 'encoded-food') dispalyName = food.data.localName;
      if (dispalyName.length > 16) dispalyName = dispalyName.slice(0, 16).concat('...');
      return dispalyName;
    },
    stringTime(time: MealTime): string {
      return fromMealTime(time, true);
    },
  },
});
</script>

<style lang="scss" scoped></style>
