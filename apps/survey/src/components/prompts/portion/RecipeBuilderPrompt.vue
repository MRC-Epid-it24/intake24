<template>
  <base-layout v-bind="{ food, prompt, isValid, fields, recipe }" @action="action">
    <v-expansion-panels>
      <v-expansion-panel v-for="(step, index) in recipe.steps" :key="index">
        <v-expansion-panel-header
          ><div>
            <b>{{ step.order }}:</b> {{ getLocaleContent(step.name) }}
          </div>
          <template #actions>
            <expansion-panel-actions :valid="isStepValid(step)"></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="pl-0">
            <p>{{ getLocaleContent(step.description) }}</p>
          </v-container>
          <v-expand-transition>
            <v-card flat>
              <food-browser
                v-bind="{
                  localeId: step.localeId,
                  rootCategory: step.categoryCode,
                  type,
                }"
                @food-missing="foodMissing(index)"
                @food-selected="(food) => foodSelected(food, index)"
              ></food-browser>
            </v-card>
          </v-expand-transition>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PromptStates, RecipeBuilderStepState } from '@intake24/common/prompts';
import type { RecipeBuilder, RequiredLocaleTranslation } from '@intake24/common/types';
import type { FoodHeader } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';
import { ExpansionPanelActions, FoodBrowser } from '@intake24/survey/components/elements';
import { useLocale } from '@intake24/ui';

import createBasePortion from './createBasePortion';

// const isPromptValid = (step: RecipeBuilderStepState): boolean =>
//   (step.confirmed && ['no'].includes(step.confirmed)) ||
//   (step.confirmed === 'yes' && step.selectedFood !== undefined);
const isStepValid = (step): boolean => false;

const { getLocaleContent } = useLocale();

export default defineComponent({
  name: 'RecipeBuilderPrompt',

  components: { ExpansionPanelActions, FoodBrowser },

  mixins: [createBasePortion<'recipe-builder-prompt', RecipeBuilder>()],

  emits: ['update'],

  data() {
    return {
      ...copy(this.initialState),
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
    };
  },

  computed: {
    // validConditions(): boolean[] {
    //   // return this.fields.map((item) => !!this.info[item]);
    //   return [true];
    // },
  },

  methods: {
    confirm() {
      this.updatePanel();
    },

    update() {
      const state: PromptStates['recipe-builder-prompt'] = {
        steps: this.steps,
        panel: this.panel,
        finishedSteps: this.finishedSteps,
        recipe: this.recipe,
      };

      this.$emit('update', { state });
    },

    foodSelected(food: FoodHeader, promptIndex: number): void {
      console.log(food, promptIndex);
    },

    foodMissing(promptIndex: number): void {
      console.log(promptIndex);
    },
  },
});
</script>

<style lang="scss" scoped></style>
