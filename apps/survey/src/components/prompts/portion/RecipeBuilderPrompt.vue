<template>
  <base-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.source`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- <yes-no-toggle v-model="finishedSteps" class="mb-4" mandatory></yes-no-toggle> -->
          <template>
            <i18n class="mb-4" :path="`prompts.${type}.homemade`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <v-textarea outlined @input="update"></v-textarea>
          </template>
          <template>
            <i18n class="mb-4" :path="`prompts.${type}.purchased`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <v-text-field outlined @input="update"></v-text-field>
            <i18n class="mb-4" :path="`prompts.${type}.barcode`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
          </template>
          <v-btn :block="isMobile" color="secondary" :disabled="false" @click="confirm">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.portionSize`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-textarea outlined @input="update"></v-textarea>
          <v-btn :block="isMobile" color="secondary" :disabled="false" @click="confirm">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { RecipeBuilder } from '@intake24/common/types';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';

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
        'link',
        // 'leftovers',
      ] as (keyof RecipeBuilder)[],
    };
  },

  computed: {
    validConditions(): boolean[] {
      // return this.fields.map((item) => !!this.info[item]);
      return [true];
    },
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
      };

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
