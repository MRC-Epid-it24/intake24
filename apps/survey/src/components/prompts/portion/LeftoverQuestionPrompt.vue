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
          <v-btn @click="submit(true)">{{ $t('common.confirm.yes') }}</v-btn>
          <v-btn @click="submit(false)">{{ $t('common.confirm.no') }}</v-btn>
        </v-card-actions>
      </v-card>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { merge } from '@common/util';
import { LeftoverQuestionPromptProps, leftoverQuestionPromptDefaultProps } from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'LeftoverQuestionPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => LeftoverQuestionPromptProps,
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
