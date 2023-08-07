<template>
  <base-layout v-bind="{ food, prompt, isValid, fields, recipe }" @action="action">
    <v-expansion-panels>
      <v-expansion-panel v-for="step in recipe.steps" :key="step.order">
        <v-expansion-panel-header>{{ getStepProperty(step.name) }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ getStepProperty(step.description) }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { RecipeBuilder, RequiredLocaleTranslation } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { useLocale } from '@intake24/ui';

import createBasePortion from './createBasePortion';

const { getLocaleContent } = useLocale();

export default defineComponent({
  name: 'RecipeBuilderPrompt',

  components: {},

  mixins: [createBasePortion<'recipe-builder-prompt', RecipeBuilder>()],

  emits: ['update'],

  data() {
    return {
      ...copy(this.initialState),
      fields: [
        // 'name',
        // 'brand',
        'description',
        'components',
        'customPromptAnswers',
        'searchTerm',
        'markedAsComplete',
        'template_id',
        'template',
        'link',
        // 'leftovers',
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

    getStepProperty(step_property: RequiredLocaleTranslation) {
      return getLocaleContent(step_property);
    },
  },
});
</script>

<style lang="scss" scoped></style>
