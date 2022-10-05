<template>
  <portion-layout v-bind="{ description, text }">
    <template #header> {{ $t('portion.directWeight.label') }} - {{ localeDescription }} </template>
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
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { DirectWeightPromptProps } from '@intake24/common/prompts';

import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'DirectWeightPrompt',

  mixins: [createBasePortion<DirectWeightPromptProps, any>()],

  props: {
    promptProps: {
      type: Object as PropType<DirectWeightPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      // Prototyping variables
      weight: 50,
    };
  },

  computed: {
    localeDescription(): string {
      return this.getLocaleContent(this.description);
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
