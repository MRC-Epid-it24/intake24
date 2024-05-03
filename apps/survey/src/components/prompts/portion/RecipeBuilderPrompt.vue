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
            <expansion-panel-actions :valid="isStepValid(step)" />
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-sheet class="mb-4">
            {{ translate(step.description) }}
          </v-sheet>

          <v-expand-transition>
            <v-radio-group
              v-if="!step.required"
              v-model="step.confirmed"
              row="true"
              @change="onConfirmToggleIngredients(index)"
            >
              <v-radio
                :label="$t('prompts.recipeBuilder.optional.confirm')"
                off-icon="fa-regular fa-circle"
                on-icon="$yes"
                value="yes"
              />
              <v-radio
                :label="$t('prompts.recipeBuilder.optional.reject')"
                off-icon="fa-regular fa-circle"
                on-icon="$no"
                value="no"
              />
            </v-radio-group>
          </v-expand-transition>

          <v-sheet v-if="!step.required && step.confirmed === 'yes'" class="mb-4">
            {{ $t('prompts.recipeBuilder.optional.infoPrompt') }}
          </v-sheet>

          <v-expand-transition>
            <selected-food-list
              v-bind="{ index, meal, prompt, step }"
              :show="step.foods.length > 0 && step.confirmed !== 'no'"
              @remove="removeFood"
            />
          </v-expand-transition>

          <v-btn-toggle
            v-if="(step.required || step.confirmed === 'yes') && step.repeat && step.foods.length > 0"
            v-model="step.anotherFoodConfirmed"
            color="primary" dense
            :row="!isMobile"
            @change="onToggleStepAddMore(index)"
          >
            <v-btn large :value="true">
              {{ $t('prompts.recipeBuilder.addMore') }}
            </v-btn>
            <v-btn large :value="false">
              {{ $t('prompts.recipeBuilder.noMore') }}
            </v-btn>
          </v-btn-toggle>

          <food-browser
            v-if="showFoodBrowser(step)"
            class="mt-2"
            v-bind="{
              localeId,
              surveySlug,
              stepName: translate(step.name),
              requiredToFill: step.required,
              rootCategory: step.categoryCode,
              prompt,
              section,
            }"
            value=""
            @food-missing="(searchTerm) => foodMissing(index, searchTerm)"
            @food-selected="(food) => foodSelected(index, food)"
            @food-skipped="foodSkipped(index)"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <missing-all-recipe-ingredients
      v-bind="{
        value: allConfirmed && !atLeastOneFoodSelected,
        message: $t('prompts.recipeBuilder.missingAllIngredients'),
      }"
      :class="{ 'mt-4': isMobile }"
    />
    <template #actions>
      <next :disabled="!isValid" @click="updateStepsIngredients" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="updateStepsIngredients" />
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
import type { FoodHeader } from '@intake24/common/types/http';
import { meal, type RecipeBuilder } from '@intake24/common/types';
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

import createBasePrompt from '../createBasePrompt';

function isStepValid(step: RecipeBuilderStepState): boolean {
  const foodSelected = step.foods.length > 0;

  if (step.required || step.confirmed === 'yes')
    return step.repeat ? foodSelected && step.anotherFoodConfirmed === false : foodSelected;
  else
    return step.confirmed === 'no';
}

function getNextStep(steps: RecipeBuilderStepState[]) {
  return steps.findIndex(step => !isStepValid(step));
}

export default defineComponent({
  name: 'RecipeBuilderPrompt',

  components: { ExpansionPanelActions, FoodBrowser, SelectedFoodList, MissingAllRecipeIngredients },

  mixins: [createBasePrompt<'recipe-builder-prompt', RecipeBuilder>()],

  props: {
    localeId: {
      type: String,
      required: true,
    },
    surveySlug: {
      type: String,
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
    meal() {
      return meal;
    },
    allConfirmed(): boolean {
      return this.recipeSteps.every(step => this.isStepValid(step));
    },

    atLeastOneFoodSelected(): boolean {
      return this.recipeSteps.some(step => step.foods.length > 0);
    },

    isValid(): boolean {
      return this.allConfirmed && this.atLeastOneFoodSelected;
    },
  },

  methods: {
    confirm() {
      console.log('Update Panel');
      // this.updatePanel();
    },

    removeFood({ foodIndex, index }: { foodIndex: number; index: number }) {
      const foodToRemove = this.recipeSteps[index].foods.splice(foodIndex, 1);
      if (!this.recipeSteps[index].foods.length)
        this.recipeSteps[index].confirmed = undefined;

      if (foodToRemove === undefined)
        return;
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
      this.recipeSteps[index].anotherFoodConfirmed = undefined;
      this.update();
    },

    async onFoodSelected(
      item:
        | { type: 'selected'; selectedFood: FoodHeader }
        | { type: 'missing'; searchTerm?: string | null },
      idx: number,
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
      }
      else {
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
        foods,
        anotherFoodConfirmed: undefined,
      };

      this.recipeSteps.splice(idx, 1, update);

      this.updateActiveStep(idx);
      this.goToNextIfCan(idx);
    },

    goToNextIfCan(index: number) {
      if (!isStepValid(this.recipeSteps[index]))
        return;

      this.activeStep = getNextStep(this.recipeSteps);
    },

    updateActiveStep(index: number) {
      const { recipeSteps } = this;
      this.$emit('input', { activeStep: index, recipeSteps });
      this.activeStep = index;
    },

    onToggleStepAddMore(stepIndex: number) {
      this.goToNextIfCan(stepIndex);
    },

    onConfirmToggleIngredients(index: number) {
      this.goToNextIfCan(index);
    },

    updateStepsIngredients() {
      console.log('Updating Steps Ingredients');
      const chosenIngredients = this.recipeSteps
        // Ignore optional steps that have been rejected even if they had
        // initially been accepted and some foods were added
        .filter(step => step.confirmed !== 'no')
        .map(({ foods }) => foods);
      this.$emit('add-food', chosenIngredients);
    },

    showFoodBrowser(step: RecipeBuilderStepState): boolean {
      if (step.required || step.confirmed === 'yes') {
        // Current step needs at least one food to be selected, and it hasn't
        if (step.foods.length === 0)
          return true;
        else
          // Some foods have already been added, but another food has been confirmed by the user
          return step.anotherFoodConfirmed === true;
      }
      else {
        // Step has not been confirmed or has been rejected (i.e. step.required is false and
        // step.confirmed is either 'no' or undefined)
        return false;
      }
    },

    action(type: string, id?: string, stepId?: number) {
      this.$emit('action', type, id, stepId);
    },
  },
});
</script>

<style lang="scss" scoped></style>
