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
              v-if="step.repeat && step.selectedFoods !== undefined"
              v-model="step.confirmed"
              :disabled="!(step.selectedFoods !== undefined && step.selectedFoods.length > 0)"
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
              v-bind="{ index, meal, prompt }"
              :entries="step"
              :show="!!step.selectedFoods?.length"
              @button-click="removeSelectedFood"
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
                  rootCategory: step.categoryCode,
                  prompt,
                }"
                @food-missing="foodMissing(index)"
                @food-selected="(food) => foodSelected(food, index)"
              ></food-browser>
            </v-card>
          </v-expand-transition>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
import { defineComponent, set } from 'vue';

import type {
  PromptStates,
  RecipeBuilderStepState,
  SelectedFoodRecipeBuilderItemState,
} from '@intake24/common/prompts';
import type { RecipeBuilder } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import {
  ExpansionPanelActions,
  FoodBrowser,
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

  components: { ExpansionPanelActions, FoodBrowser, SelectedFoodList },

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

    isValid(): boolean {
      return this.allConfirmed;
    },
  },

  methods: {
    confirm() {
      console.log('Update Panel');
      //this.updatePanel();
    },

    replaceFoodIndex(index: number) {
      console.log('Replace Food Index', index);
      // this.food.link.map(() => undefined as number | undefined);
    },

    removeSelectedFood(data: { foodIndex: number; index: number }) {
      const foodToRemove = this.recipeSteps[data.index].selectedFoods?.splice(data.foodIndex, 1);
      if (this.recipeSteps[data.index].selectedFoods?.length === 0) {
        this.recipeSteps[data.index].confirmed = undefined;
      }
      if (foodToRemove === undefined) return;
      this.update();
      //this.action('remove', foodToRemove[0].id, data.index);
    },

    update() {
      const state: PromptStates['recipe-builder-prompt'] = {
        recipeSteps: this.recipeSteps,
        activeStep: this.activeStep,
        finishedSteps: this.finishedSteps,
        recipe: this.recipe,
      };

      this.$emit('input', state);
    },

    foodSelected(food: SelectedFoodRecipeBuilderItemState, ingredientIndex: number): void {
      const selectedFoods = this.recipeSteps[ingredientIndex].selectedFoods;
      this.onFoodSelected(
        {
          ...this.recipeSteps[ingredientIndex],
          type: 'selected',
          selectedFoods: selectedFoods ? [...selectedFoods, food] : [food],
        },
        ingredientIndex,
        food
      );
    },

    foodMissing(ingredientIndex: number): void {},

    async onFoodSelected(
      stepFoods: RecipeBuilderStepState,
      ingredientIndex: number,
      foodForSearch: SelectedFoodRecipeBuilderItemState
    ): Promise<void> {
      if (!stepFoods.selectedFoods) return;

      const foodData = await foodsService.getData(this.localeId, foodForSearch.code);

      const step = this.recipeSteps[ingredientIndex];
      const replaceIndex = this.replaceFoodIndex(ingredientIndex);
      const id = getEntityId();
      const data = { ingredient: foodData, idx: ingredientIndex, id: id };

      const foods = step.selectedFoods ? step.selectedFoods.slice() : [];

      if (!step.repeat && replaceIndex !== undefined) {
        foods[replaceIndex] = stepFoods.selectedFoods[replaceIndex];
        set(this.replaceFoodIndex, ingredientIndex, undefined);
      } else {
        foods.push({
          code: data.ingredient.code,
          name: data.ingredient.localName,
          id: data.id ?? '',
          data: data,
        });
      }

      const update = {
        ...step,
        type: stepFoods.type,
        confirmed: step.repeat !== true ? 'yes' : ('no' as RecipeBuilderStepState['confirmed']),
        selectedFoods: foods,
      };

      this.recipeSteps.splice(ingredientIndex, 1, update);

      this.updateActiveStep(ingredientIndex);
      this.goToNextIfCan(ingredientIndex);

      //this.$emit('add-food', data);
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
      const chosenIngredients = this.recipeSteps.map(
        (step) => step.selectedFoods?.map((food) => food.data)
      );
      this.$emit('add-food', chosenIngredients);
    },

    action(type: string, id?: string, stepId?: number) {
      this.$emit('action', type, id, stepId);
    },
  },
});
</script>

<style lang="scss" scoped></style>
