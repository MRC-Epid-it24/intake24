<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template #header>{{ $t('prompts.directWeight.label') }} - {{ localeDescription }}</template>
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
  </base-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'DirectWeightPrompt',

  mixins: [createBasePortion<'direct-weight-prompt'>()],

  data() {
    return {
      // Prototyping variables
      weight: 50,
    };
  },

  computed: {
    localeDescription(): string {
      return this.translate(this.prompt.i18n.description);
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
