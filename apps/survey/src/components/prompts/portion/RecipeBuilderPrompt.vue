<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }">
    <v-expansion-panels v-model="activeStep" :tile="isMobile" @change="updateActiveStep">
      <v-expansion-panel v-for="(step, index) in recipeSteps" :key="index">
        <v-expansion-panel-header>
          <div>
            <v-avatar class="mr-2" color="primary" size="28">
              <span class="white--text font-weight-medium">{{ step.order + 1 }}</span>
            </v-avatar>
            {{ translate(step.name) }}
          </div>
          <template #actions>
            <expansion-panel-actions :valid="isStepValid(step)"></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="pl-0">
            <p>{{ translate(step.description) }}</p>
            <v-radio-group
              v-if="step.repeat"
              v-model="step.confirmed"
              :disabled="!step.foods.length"
              :row="!isMobile"
              @change="onConfirmToggleIngredients(index)"
            >
              <v-radio
                :label="$t('prompts.recipeBuilder.addMore')"
                off-icon="fa-regular fa-circle"
                on-icon="$yes"
                :value="'no'"
              ></v-radio>
              <v-radio
                :label="$t('prompts.recipeBuilder.noMore')"
                off-icon="fa-regular fa-circle"
                on-icon="$yes"
                :value="'yes'"
              ></v-radio>
            </v-radio-group>
          </v-container>
          <v-expand-transition>
            <selected-food-list
              v-bind="{ index, meal, prompt, step }"
              :show="!!step.foods.length"
              @remove="removeFood"
            ></selected-food-list>
          </v-expand-transition>
          <v-expand-transition>
            <v-card
              v-if="step.confirmed !== 'yes' || (step.confirmed === 'yes' && step.repeat)"
              flat
            >
              <food-browser
                v-bind="{
                  localeId,
                  searchParameters,
                  stepName: translate(step.name),
                  requiredToFill: step.required,
                  rootCategory: step.categoryCode,
                  prompt,
                }"
                @food-missing="(searchTerm) => foodMissing(index, searchTerm)"
                @food-selected="(food) => foodSelected(index, food)"
                @food-skipped="foodSkipped(index)"
              ></food-browser>
            </v-card>
          </v-expand-transition>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <missing-all-recipe-ingredients
      v-bind="{
        value: allConfirmed && !atLeastOneFoodSelected,
        message: $t('prompts.recipeBuilder.missingAllIngredients'),
      }"
      :class="{ 'mt-4': isMobile }"
    ></missing-all-recipe-ingredients>
    <template #actions>
      <next :disabled="!isValid" @click="updateStepsIngredients"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="updateStepsIngredients"></next-mobile>
    </template>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type {
  MissingFoodRecipeBuilderItemState,
  PromptStates,
  RecipeBuilderStepState,
  SelectedFoodRecipeBuilderItemState,
} from '@intake24/common/prompts';
import type { RecipeBuilder } from '@intake24/common/types';
import type { FoodHeader } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import {
  ExpansionPanelActions,
  FoodBrowser,
  MissingAllRecipeIngredients,
  SelectedFoodList,
} from '@intake24/survey/components/elements';
import { foodsService } from '@intake24/survey/services';
import { getEntityId } from '@intake24/survey/util';

import type { FoodSearchPromptParameters } from '../standard';
import createBasePrompt from '../createBasePrompt';

const isStepValid = (step: RecipeBuilderStepState): boolean =>
  step.confirmed !== undefined && step.confirmed === 'yes';

const getNextStep = (steps: RecipeBuilderStepState[]) =>
  steps.findIndex((step) => !isStepValid(step));

export default defineComponent({
  name: 'RecipeBuilderPrompt',

  components: { ExpansionPanelActions, FoodBrowser, SelectedFoodList, MissingAllRecipeIngredients },

  mixins: [createBasePrompt<'recipe-builder-prompt', RecipeBuilder>()],

  props: {
    localeId: {
      type: String,
      required: true,
    },
    searchParameters: {
      type: Object as PropType<FoodSearchPromptParameters>,
      required: true,
    },
    value: {
      type: Object as PropType<PromptStates['recipe-builder-prompt']>,
      required: true,
    },
  },

  emits: ['input', 'add-food', 'action'],

  setup() {
    const { translate } = useI18n();

    return {
      isStepValid,
      translate,
    };
  },

  data() {
    return {
      ...copy(this.value),
    };
  },

  computed: {
    allConfirmed(): boolean {
      return this.recipeSteps.reduce((acc, curr) => acc && curr.confirmed === 'yes', true);
    },

    atLeastOneFoodSelected(): boolean {
      return this.recipeSteps.reduce((acc, curr) => acc || !!curr.foods.length, false);
    },

    isValid(): boolean {
      return this.allConfirmed && this.atLeastOneFoodSelected;
    },
  },

  methods: {
    confirm() {
      console.log('Update Panel');
      //this.updatePanel();
    },

    removeFood({ foodIndex, index }: { foodIndex: number; index: number }) {
      const foodToRemove = this.recipeSteps[index].foods.splice(foodIndex, 1);
      if (!this.recipeSteps[index].foods.length) this.recipeSteps[index].confirmed = undefined;

      if (foodToRemove === undefined) return;
      this.update();
    },

    update() {
      const state: PromptStates['recipe-builder-prompt'] = {
        recipeSteps: this.recipeSteps,
        activeStep: this.activeStep,
        recipe: this.recipe,
      };

      this.$emit('input', state);
    },

    foodSelected(index: number, selectedFood: SelectedFoodRecipeBuilderItemState): void {
      this.onFoodSelected({ type: 'selected', selectedFood }, index);
    },

    foodMissing(index: number, searchTerm?: string | null) {
      this.onFoodSelected({ type: 'missing', searchTerm }, index);
    },

    foodSkipped(index: number): void {
      this.activeStep = index + 1;
      this.recipeSteps[index].confirmed = 'yes';
      this.update();
    },

    async onFoodSelected(
      item:
        | { type: 'selected'; selectedFood: FoodHeader }
        | { type: 'missing'; searchTerm?: string | null },
      idx: number
    ): Promise<void> {
      const step = this.recipeSteps[idx];
      const id = getEntityId();

      let food: MissingFoodRecipeBuilderItemState | SelectedFoodRecipeBuilderItemState;
      if (item.type === 'missing') {
        food = {
          ...item,
          id,
          idx,
          name: `${step.categoryCode}: ${item.searchTerm ? item.searchTerm : step.name.en}`,
        };
      } else {
        const { selectedFood, type } = item;
        const ingredient = await foodsService.getData(this.localeId, selectedFood.code);
        food = {
          type,
          ...selectedFood,
          name: ingredient.localName,
          id,
          idx,
          ingredient,
        };
      }

      const foods = step.foods.slice();
      foods.push(food);

      const update: RecipeBuilderStepState = {
        ...step,
        confirmed: step.repeat !== true ? 'yes' : 'no',
        foods,
      };

      this.recipeSteps.splice(idx, 1, update);

      this.updateActiveStep(idx);
      this.goToNextIfCan(idx);
    },

    goToNextIfCan(index: number) {
      if (!isStepValid(this.recipeSteps[index])) return;

      this.activeStep = getNextStep(this.recipeSteps);
    },

    updateActiveStep(index: number) {
      const { recipeSteps } = this;
      this.$emit('input', { activeStep: index, recipeSteps });
      this.activeStep = index;
    },

    onConfirmToggleIngredients(index: number) {
      this.goToNextIfCan(index);
    },

    updateStepsIngredients() {
      console.log('Updating Steps Ingredients');
      const chosenIngredients = this.recipeSteps.map(({ foods }) => foods);
      this.$emit('add-food', chosenIngredients);
    },

    action(type: string, id?: string, stepId?: number) {
      this.$emit('action', type, id, stepId);
    },
  },
});
</script>

<style lang="scss" scoped></style>
