<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.source`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="homemadeValid" />
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <yes-no-toggle v-model="homemadePrompt" class="mb-4" mandatory />
          <template v-if="homemadePrompt === true">
            <i18n class="mb-4" :path="`prompts.${type}.homemade`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <v-textarea v-model="info.description" outlined @input="update" />
          </template>
          <template v-if="homemadePrompt === false">
            <i18n class="mb-4" :path="`prompts.${type}.purchased`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <v-text-field v-model="info.brand" outlined @input="update" />
            <i18n class="mb-4" :path="`prompts.${type}.barcode`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <component
              :is="prompt.barcode.type"
              :model-value.sync="info.barcode"
              :options="prompt.barcode"
              outlined
            />
          </template>
          <v-btn :block="isMobile" color="primary" :disabled="!homemadeValid" @click="confirm">
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
            <expansion-panel-actions :valid="!!info.portionSize" />
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-textarea v-model="info.portionSize" outlined @input="update" />
          <v-btn :block="isMobile" color="primary" :disabled="!info.portionSize" @click="confirm">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { MissingFood } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';
import { barcodes } from '@intake24/ui';

import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'MissingFoodPrompt',

  components: { ...barcodes, YesNoToggle },

  mixins: [createBasePortion<'missing-food-prompt', MissingFood>()],

  emits: ['input'],

  data() {
    return {
      ...copy({
        ...this.value,
        homemadePrompt:
          !this.value.info.description && !this.value.info.brand
            ? undefined
            : !!this.value.info.description,
      }),
    };
  },

  computed: {
    homemadeValid() {
      return (
        (this.homemadePrompt === true && !!this.info.description)
        || (this.homemadePrompt === false && !!this.info.brand)
      );
    },
    validConditions(): boolean[] {
      return [this.homemadeValid, !!this.info.portionSize];
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

      this.$emit('input', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
