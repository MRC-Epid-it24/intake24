<template>
  <prompt-layout v-bind="{ description, text }">
    <v-card-actions :class="isNotDesktop && 'justify-center'">
      <v-expansion-panels v-model="activePrompt" @change="updatePrompts">
        <v-expansion-panel v-for="(prompt, index) in prompts" :key="index">
          <v-expansion-panel-header class="text-body-1" color="#f5f5f5" disable-icon-rotate>
            {{ associatedFoodPrompts[index].promptText }}
            <template #actions>
              <valid-invalid-icon
                :valid="
                  prompt.confirmed === 'no' ||
                  prompt.confirmed === 'existing' ||
                  (prompt.confirmed === 'yes' && prompt.selectedFood !== undefined)
                "
              ></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pl-0">
            <v-container class="pl-0">
              <v-radio-group v-model="prompt.confirmed" row @change="onConfirmStateChanged(index)">
                <v-radio
                  :label="$t('prompts.associatedFoods.no')"
                  off-icon="fa-regular fa-circle"
                  on-icon="fa-regular fa-circle-check"
                  value="no"
                ></v-radio>
                <v-radio
                  :label="$t('prompts.associatedFoods.yes')"
                  off-icon="fa-regular fa-circle"
                  on-icon="fa-regular fa-circle-check"
                  value="yes"
                ></v-radio>
                <v-radio
                  v-if="prompt.confirmed === 'existing' || foodsAlreadyEntered[index] !== undefined"
                  :label="$t('prompts.associatedFoods.alreadyEntered')"
                  off-icon="fa-regular fa-circle"
                  on-icon="fa-regular fa-circle-check"
                  value="existing"
                ></v-radio>
              </v-radio-group>
            </v-container>
            <v-card v-if="prompt.confirmed === 'yes' && prompt.selectedFood !== undefined" flat>
              <v-card-title>
                <span class="fa fa-check mr-2"></span>
                {{ prompt.selectedFood.description }}
              </v-card-title>
              <v-card-actions>
                <v-btn @click="onSelectDifferentFood(prompt)">Select a different food </v-btn>
              </v-card-actions>
            </v-card>
            <v-expand-transition>
              <v-card v-show="prompt.confirmed === 'yes' && prompt.selectedFood === undefined" flat>
                <v-card-title class="pl-0 pa-2" style="border-bottom: 1px solid lightgray"
                  >Please select an item from this category:</v-card-title
                >
                <v-card-text class="pl-0">
                  <food-browser
                    :locale-id="localeId"
                    :root-category="associatedFoodPrompts[index].categoryCode"
                    @food-selected="(food) => onFoodSelected(food, index)"
                  ></food-browser>
                </v-card-text>
              </v-card>
            </v-expand-transition>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-actions>
    <template #actions>
      <continue :disabled="!isValid" @click="onContinue"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import Vue, { defineComponent } from 'vue';

import type { AssociatedFoodsPromptProps } from '@intake24/common/prompts';
import type {
  AssociatedFoodPromptState,
  AssociatedFoodsState,
  EncodedFood,
} from '@intake24/common/types';
import type { FoodHeader, UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import { FoodBrowser, ValidInvalidIcon } from '@intake24/survey/components/elements';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndexRequired } from '@intake24/survey/stores/meal-food-utils';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'AssociatedFoodsPrompt',

  components: { FoodBrowser, ValidInvalidIcon },

  mixins: [BasePrompt],

  props: {
    initialState: {
      type: Object as PropType<AssociatedFoodsState>,
      required: true,
    },
    food: {
      type: Object as PropType<EncodedFood>,
      required: true,
    },
    localeId: {
      type: String,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<AssociatedFoodsPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      activePrompt: this.initialState.activePrompt,
      prompts: this.initialState.prompts,
      usedExistingFoodIds: [] as number[],
    };
  },

  computed: {
    ...mapState(useSurvey, ['meals']),

    foodsAlreadyEntered(): (number | undefined)[] {
      const foodIndex = getFoodIndexRequired(this.meals, this.food.id);
      const foodsInThisMeal = this.meals[foodIndex.mealIndex].foods;

      return this.associatedFoodPrompts.map((prompt) => {
        for (const food of foodsInThisMeal) {
          // Don't link food to itself
          if (food.id === this.food.id) continue;

          // Rare corner case: two or more prompts from the same food refer to the same
          // food or category
          if (this.usedExistingFoodIds.includes(food.id)) continue;

          // Don't allow linking foods that have linked foods of their own
          if (food.linkedFoods.length) continue;

          if (
            prompt.foodCode !== undefined &&
            food.type === 'encoded-food' &&
            food.data.code === prompt.foodCode
          )
            return food.id;

          if (
            prompt.categoryCode !== undefined &&
            food.type === 'encoded-food' &&
            food.data.categories.includes(prompt.categoryCode)
          )
            return food.id;
        }

        return undefined;
      });
    },

    associatedFoodPrompts(): UserAssociatedFoodPrompt[] {
      return this.food.data.associatedFoodPrompts;
    },

    foodName(): string {
      return this.food.data.localName;
    },

    text(): string {
      return this.getLocaleContent(this.promptProps.text, {
        path: 'prompts.associatedFoods.text',
        params: { food: this.foodName.toLocaleLowerCase() },
      });
    },

    description(): string {
      return this.getLocaleContent(this.promptProps.description, {
        path: 'prompts.associatedFoods.description',
      });
    },

    isValid(): boolean {
      return this.prompts.every(
        (prompt) =>
          prompt.confirmed === 'no' ||
          prompt.confirmed === 'existing' ||
          (prompt.confirmed === 'yes' && prompt.selectedFood !== undefined)
      );
    },
  },

  methods: {
    onConfirmStateChanged(index: number) {
      if (this.prompts[index].confirmed === 'existing') {
        const foodId = this.foodsAlreadyEntered[index];

        if (foodId !== undefined) {
          Vue.set(this.prompts, index, {
            confirmed: 'existing',
            existingFoodId: foodId,
            selectedFood: this.prompts[index].selectedFood,
          });

          this.usedExistingFoodIds.push(foodId);
        }
      } else {
        const existingFoodId = this.prompts[index].existingFoodId;

        if (existingFoodId !== undefined) {
          this.usedExistingFoodIds = this.usedExistingFoodIds.filter((id) => id !== existingFoodId);
        }

        Vue.set(this.prompts, index, {
          confirmed: this.prompts[index].confirmed,
          selectedFood: this.prompts[index].selectedFood,
        });
      }

      this.updatePrompts();
    },

    onSelectDifferentFood(prompt: AssociatedFoodPromptState) {
      prompt.selectedFood = undefined;
      this.updatePrompts();
    },

    onFoodSelected(food: FoodHeader, promptIndex: number): void {
      Vue.set(this.prompts, promptIndex, {
        confirmed: 'yes',
        selectedFood: food,
      });
      this.updatePrompts();
    },

    updatePrompts() {
      const { activePrompt, prompts } = this;

      this.$emit('update', { state: { activePrompt, prompts }, valid: this.isValid });
    },

    onContinue() {
      this.$emit('continue');
    },
  },
});
</script>

<style lang="scss" scoped></style>
