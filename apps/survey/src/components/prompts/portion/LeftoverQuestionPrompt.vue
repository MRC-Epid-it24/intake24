<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ localeDescription }}
      </template>
      <v-card>
        <v-card-text>
          {{ $t('portion.asServedLeftover.question', { food: localeDescription }) }}
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit(true)">{{ $t('common.action.confirm.yes') }}</v-btn>
          <v-btn @click="submit(false)">{{ $t('common.action.confirm.no') }}</v-btn>
        </v-card-actions>
      </v-card>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { PropType } from '@vue/composition-api';
import { merge } from '@intake24/common/util';
import type { LeftoverQuestionPromptProps } from '@intake24/common/prompts';
import { leftoverQuestionPromptDefaultProps } from '@intake24/common/prompts';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import type { Portion } from './BasePortion';
import BasePortion from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'LeftoverQuestionPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<LeftoverQuestionPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(leftoverQuestionPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      computeLeftovers: false,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  methods: {
    submit(value: boolean) {
      this.$emit('Leftover method required', value);
    },
  },
});
</script>

<style lang="scss" scoped></style>
