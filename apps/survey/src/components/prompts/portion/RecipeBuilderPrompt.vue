<template>
  <base-layout v-bind="{ food, meal, prompt, section, fields, recipe }">
    <v-expansion-panels v-model="activeStep" :tile="isMobile" @change="updateActiveStep">
      <v-expansion-panel v-for="(step, index) in recipeSteps" :key="index">
        <v-expansion-panel-header
          ><div>
            <b>{{ step.order + 1 }}:</b> {{ translate(step.name) }}
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
              @change="onConfirmToggleIngerients(index)"
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
              :entries="step"
              :index="index"
              :meal="meal"
              :prompt="prompt"
              :show="step.selectedFoods !== undefined && step.selectedFoods.length > 0"
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
                  localeId: localeId,
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
      <next :disabled="!allStepsFinished" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!allStepsFinished" @click="action('next')"></next-mobile>
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
import type { FoodHeader } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import {
  ExpansionPanelActions,
  FoodBrowser,
  SelectedFoodList,
} from '@intake24/survey/components/elements';
import { foodsService } from '@intake24/survey/services';
import { getEntityId } from '@intake24/survey/util';

import createBasePrompt from '../createBasePrompt';

const isStepValid = (step: RecipeBuilderStepState): boolean =>
  step.confirmed !== undefined && step.confirmed === 'yes';

const getNextStep = (steps: RecipeBuilderStepState[]) =>
  steps.findIndex((step) => !isStepValid(step));

const { translate } = useI18n();

export default defineComponent({
  name: 'RecipeBuilderPrompt',

  components: { ExpansionPanelActions, FoodBrowser, SelectedFoodList },

  mixins: [createBasePrompt<'recipe-builder-prompt'>()],

  props: {
    food: {
      type: Object as PropType<RecipeBuilder>,
      required: true,
    },
    localeId: {
      type: String,
      required: true,
    },
    value: {
      type: Object as PropType<PromptStates['recipe-builder-prompt']>,
      required: true,
    },
  },

  emits: ['input', 'update', 'add-food', 'action'],

  data(props) {
    return {
      ...copy(this.value),
      isStepValid,
      fields: [
        'description',
        'components',
        'customPromptAnswers',
        'searchTerm',
        'markedAsComplete',
        'template_id',
        'template',
        'link',
      ] as (keyof RecipeBuilder)[],
      translate,
    };
  },

  computed: {
    allStepsFinished(): boolean {
      return this.allConfirmed();
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
      this.action('remove', foodToRemove[0].id, data.index);
    },

    update() {
      const state: PromptStates['recipe-builder-prompt'] = {
        recipeSteps: this.recipeSteps,
        activeStep: this.activeStep,
        finishedSteps: this.finishedSteps,
        recipe: this.recipe,
      };

      this.$emit('update', { state });
    },

    foodSelected(food: SelectedFoodRecipeBuilderItemState, ingredientIndex: number): void {
      const selectedFoods = this.recipeSteps[ingredientIndex].selectedFoods;
      this.onFoodSelected(
        {
          ...this.recipeSteps[ingredientIndex],
          type: 'selected',
          selectedFoods: selectedFoods === undefined ? [food] : [...selectedFoods, food],
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
      if (stepFoods.selectedFoods === undefined) {
        return;
      }

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

      this.$emit('add-food', data);
    },

    goToNextIfCan(index: number) {
      if (!isStepValid(this.recipeSteps[index])) return;

      this.activeStep = getNextStep(this.recipeSteps);
    },

    updateActiveStep(index: number) {
      const { activeStep, recipeSteps } = this;
      this.$emit('input', { activeStep: index, recipeSteps });
      this.activeStep = index;
    },

    onConfirmToggleIngerients(index: number) {
      this.goToNextIfCan(index);
    },

    allConfirmed(): boolean {
      return this.recipeSteps.reduce((acc, curr) => {
        return acc && curr.confirmed === 'yes';
      }, true);
    },

    action(type: string, id?: string, stepId?: number) {
      this.$emit('action', type, id, stepId);
    },
  },
});
</script>

<style lang="scss" scoped></style>
