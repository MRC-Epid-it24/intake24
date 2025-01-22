<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :tile="$vuetify.display.mobile">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.source`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="homemadeValid" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <yes-no-toggle v-model="homemadePrompt" class="mb-4" mandatory />
          <template v-if="homemadePrompt === true">
            <i18n-t class="mb-4" :keypath="`prompts.${type}.homemade`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n-t>
            <v-textarea v-model="info.description" @update:model-value="update" />
          </template>
          <template v-if="homemadePrompt === false">
            <i18n-t class="mb-4" :keypath="`prompts.${type}.purchased`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n-t>
            <v-text-field v-model="info.brand" @update:model-value="update" />
            <i18n-t class="mb-4" :keypath="`prompts.${type}.barcode`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n-t>
            <component
              :is="`${prompt.barcode.type}-input`"
              v-model:model-value="info.barcode"
              :options="prompt.barcode"
              outlined
            />
          </template>
          <v-btn v-if="homemadePrompt !== undefined" :block="$vuetify.display.mobile" color="primary" :disabled="!homemadeValid" @click="confirm">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.portionSize`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="!!info.portionSize" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-textarea v-model="info.portionSize" @update:model-value="update" />
          <v-btn :block="$vuetify.display.mobile" color="primary" :disabled="!info.portionSize" @click="confirm">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-expansion-panel-text>
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
import type { MissingFood } from '@intake24/common/surveys';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';
import { barcodes } from '@intake24/ui';

import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'MissingFoodPrompt',

  components: { ...barcodes, YesNoToggle },

  mixins: [createBasePortion<'missing-food-prompt', MissingFood>()],

  emits: ['update:modelValue'],

  data() {
    return {
      ...copy({
        ...this.modelValue,
        homemadePrompt:
          !this.modelValue.info.description && !this.modelValue.info.brand
            ? undefined
            : !!this.modelValue.info.description,
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

      this.$emit('update:modelValue', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
