<template>
  <prompt-layout :text="text" :description="description">
    <v-col md="8" sm="12" class="px-0 px-sm-3 align-center text-center justify-center">
      <survey-progress-bar :meals="meals"></survey-progress-bar>
      <v-divider></v-divider>
    </v-col>
    <v-col md="8" sm="12" class="px-0 px-sm-3 align-center text-center justify-center">
      <v-card flat dense>
        <v-list dense class="flex-grow-1 flex-shrink-0">
          <v-list-item
            :ripple="false"
            :inactive="true"
            v-for="(meal, idx) in meals"
            :key="meal.name + idx"
            link
          >
            <v-list-item-icon>
              <v-icon> $meal</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-group :value="meal.time ? true : false">
                <template v-slot:activator>
                  <v-list-item-title
                    class="font-weight-bold text-wrap"
                    @click="chooseMeal(idx, meal.name, meal.foods, 'meal')"
                  >
                    {{ meal.localName[$i18n.locale] }}
                  </v-list-item-title>
                  <v-list-item-action>
                    <v-list-item-action-text
                      v-if="meal.time"
                      v-text="stringTime(meal.time)"
                    ></v-list-item-action-text>
                    <v-icon x-small v-else>far fa-question-circle </v-icon>
                  </v-list-item-action>
                </template>
                <v-list v-if="meal.foods.length > 0 && meal.time ? true : false">
                  <v-list-item v-for="(food, i) in meal.foods" :key="i" link>
                    <v-list-item-title
                      class="text-wrap"
                      v-text="foodDisplayName(food)"
                      @click="chooseFood(i, idx, foodDisplayName(food), 'food')"
                    ></v-list-item-title>
                    <v-list-item-action>
                      <v-icon x-small v-if="food.data" color="sucess">fa-check</v-icon>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-icon x-small v-if="food.portionSizeMethod" color="sucess">fa-check</v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-list-group>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <template v-slot:actions> </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { FoodState, MealState, MealTime } from '@intake24/common/types';
import timeDoubleDigitsConvertor from '@intake24/survey/components/mixins/timeDoubleDigitsConvertor';
import { BasePromptProps } from '@intake24/common/prompts';
import SurveyProgressBar from '@intake24/survey/components/elements/SurveyProgressBar.vue';
import Submit from '@intake24/survey/components/prompts/actions/Submit.vue';
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
    meals: Array as PropType<MealState[]>,
    promptComponent: {
      type: String,
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
    chooseMeal(mealIndex: number, name: string, foods: FoodState[], entity: string) {
      this.$emit('meal-selected', { mealIndex, name, foods, entity });
    },
    chooseFood(foodIndex: number, mealIndex: number, name: string, entity: string) {
      this.$emit('food-selected', { foodIndex, mealIndex, name, entity });
    },
    foodDisplayName(food: FoodState) {
      let dispalyName = '???';
      if (food.type === 'free-text') dispalyName = food.description;
      if (food.type === 'encoded-food') dispalyName = food.data.localName;
      if (dispalyName.length > 16) dispalyName = dispalyName.slice(0, 16).concat('...');
      return dispalyName;
    },
    stringTime(time: MealTime): string {
      return timeDoubleDigitsConvertor(time.hours)
        .concat(':')
        .concat(timeDoubleDigitsConvertor(time.minutes));
    },
  },
});
</script>

<style lang="scss" scoped></style>
