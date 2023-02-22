<template>
  <portion-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :flat="isMobile" :tile="isMobile">
      <v-expansion-panel v-for="field in fields" :key="field">
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.info.${field}`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="!!info[field]"></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <component
            :is="['name', 'brand'].includes(field) ? 'v-text-field' : 'v-textarea'"
            v-model="info[field]"
            outlined
            @input="update"
          ></component>
          <v-btn :block="isMobile" color="secondary" :disabled="!info[field]" @click="confirm">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { VTextarea, VTextField } from 'vuetify/lib';

import type { MissingFood } from '@intake24/common/types';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';

export interface MissingFoodPromptState {
  info: NonNullable<MissingFood['info']>;
  panel: number;
}

export default defineComponent({
  name: 'MissingFoodPrompt',

  components: { VTextField, VTextarea },

  mixins: [createBasePortion<'missing-food-prompt', MissingFoodPromptState>()],

  props: {
    food: {
      type: Object as PropType<MissingFood>,
      required: true,
    },
  },

  emits: ['update'],

  data() {
    return {
      ...copy(this.initialState),
      fields: [
        'name',
        'brand',
        'description',
        'portionSize',
        'leftovers',
      ] as (keyof MissingFoodPromptState['info'])[],
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
      const state: MissingFoodPromptState = { info: this.info, panel: this.panel };

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
