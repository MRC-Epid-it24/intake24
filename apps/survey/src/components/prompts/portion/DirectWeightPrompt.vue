<template>
  <v-container>
    <portion-layout :description="description" :text="text">
      <template #headerText>
        {{ $t('portion.directWeight.label') }} - {{ localeDescription }}
      </template>
      <v-row>
        <v-col>
          <v-card>
            Portion: {{ weight }}g
            <v-card-actions>
              <v-btn @click="quantity(-1)"> - </v-btn>
              <v-btn @click="quantity(1)"> + </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { DirectWeightPromptProps } from '@intake24/common/prompts';
import { directWeightPromptDefaultProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { localeContent } from '@intake24/survey/components/mixins';

import BasePortion from './BasePortion';

export default defineComponent({
  name: 'DirectWeightPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<DirectWeightPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(directWeightPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      // Prototyping variables
      weight: 50,
    };
  },

  computed: {
    localeDescription(): string {
      return this.getLocaleContent(this.description);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  methods: {
    quantity(value: number) {
      this.weight += value;
    },
  },
});
</script>

<style lang="scss" scoped></style>
