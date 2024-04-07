<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-col class="px-0 px-sm-3 align-center text-center justify-center" md="8" sm="12">
      <survey-progress-bar :meals="meals" />
      <v-divider />
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
                    <v-icon v-else x-small>
                      $question
                    </v-icon>
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
                      <v-icon v-if="food.data" color="success" x-small>
                        $ok
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-icon v-if="food.portionSizeMethod" color="success" x-small>
                        $ok
                      </v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-list-group>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodState, MealState, MealTime } from '@intake24/common/types';
import { fromMealTime } from '@intake24/common/surveys';
import { SurveyProgressBar } from '@intake24/survey/components/elements';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'ReviewConfirmPrompt',

  components: { SurveyProgressBar },

  mixins: [createBasePrompt<'review-confirm-prompt'>()],

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  emits: ['meal-selected', 'food-selected'],

  setup(props, ctx) {
    const { action } = usePromptUtils(props, ctx);
    const isValid = true;

    return { action, isValid };
  },

  methods: {
    chooseMeal(mealId: string, name: string, foods: FoodState[], entity: string) {
      this.$emit('meal-selected', { mealId, name, foods, entity });
    },
    chooseFood(foodId: string, name: string, entity: string) {
      this.$emit('food-selected', { foodId, name, entity });
    },
    foodDisplayName(food: FoodState) {
      let dispalyName = '???';
      if (food.type === 'free-text')
        dispalyName = food.description;
      if (food.type === 'encoded-food')
        dispalyName = food.data.localName;
      if (dispalyName.length > 16)
        dispalyName = dispalyName.slice(0, 16).concat('...');
      return dispalyName;
    },
    stringTime(time: MealTime): string {
      return fromMealTime(time);
    },
  },
});
</script>

<style lang="scss" scoped></style>
