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
            <expansion-panel-actions :valid="!!info.description"></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <yes-no-toggle v-model="homemadePrompt" class="mb-4" mandatory></yes-no-toggle>
          <template v-if="homemadePrompt === true">
            <i18n class="mb-4" :path="`prompts.${type}.homemade`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <v-textarea v-model="info.description" outlined @input="update"></v-textarea>
          </template>
          <template v-if="homemadePrompt === false">
            <i18n class="mb-4" :path="`prompts.${type}.purchased`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <v-text-field v-model="info.description" outlined @input="update"></v-text-field>
            <i18n class="mb-4" :path="`prompts.${type}.barcode`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <barcode-input :model-value.sync="info.barcode"></barcode-input>
          </template>
          <v-btn :block="isMobile" color="secondary" :disabled="!info.description" @click="confirm">
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
            <expansion-panel-actions :valid="!!info.portionSize"></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-textarea v-model="info.portionSize" outlined @input="update"></v-textarea>
          <v-btn :block="isMobile" color="secondary" :disabled="!info.portionSize" @click="confirm">
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
import type { MissingFood } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';
import { BarcodeInput } from '@intake24/ui';

import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'MissingFoodPrompt',

  components: { BarcodeInput, YesNoToggle },

  mixins: [createBasePortion<'missing-food-prompt', MissingFood>()],

  emits: ['update'],

  data() {
    return {
      ...copy(this.initialState),
      fields: [
        // 'name',
        // 'brand',
        'description',
        'portionSize',
        // 'leftovers',
      ] as (keyof MissingFood['info'])[],
    };
  },

  computed: {
    validConditions(): boolean[] {
      return this.fields.map((item) => !!this.info[item]);
    },
  },

  methods: {
    confirm() {
      this.updatePanel();
    },

    update() {
      const state: PromptStates['missing-food-prompt'] = {
        info: this.info,
        panel: this.panel,
        homemadePrompt: this.homemadePrompt,
      };

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
