<template>
  <base-layout v-bind="{ food, prompt, section, fields, recipe }">
    <v-expansion-panels>
      <v-expansion-panel v-for="(step, index) in recipe.steps" :key="index">
        <v-expansion-panel-header
          ><div>
            <b>{{ step.order }}:</b> {{ translate(step.name) }}
          </div>
          <template #actions>
            <expansion-panel-actions :valid="isStepValid(step)"></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="pl-0">
            <p>{{ translate(step.description) }}</p>
          </v-container>
          <v-expand-transition>
            <v-card flat>
              <food-browser
                v-bind="{
                  localeId: step.localeId,
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
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptStates, RecipeBuilderStepState } from '@intake24/common/prompts';
import type { RecipeBuilder } from '@intake24/common/types';
import type { FoodHeader } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { ExpansionPanelActions, FoodBrowser } from '@intake24/survey/components/elements';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

// const isPromptValid = (step: RecipeBuilderStepState): boolean =>
//   (step.confirmed && ['no'].includes(step.confirmed)) ||
//   (step.confirmed === 'yes' && step.selectedFood !== undefined);
const isStepValid = (step: any): boolean => false;

const { translate } = useI18n();

export default defineComponent({
  name: 'RecipeBuilderPrompt',

  components: { ExpansionPanelActions, FoodBrowser },

  mixins: [createBasePrompt<'recipe-builder-prompt', RecipeBuilder>()],

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

  emits: ['update'],

  data() {
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
    // validConditions(): boolean[] {
    //   // return this.fields.map((item) => !!this.info[item]);
    //   return [true];
    // },
  },

  methods: {
    confirm() {
      console.log('Update Panel');
      //this.updatePanel();
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
