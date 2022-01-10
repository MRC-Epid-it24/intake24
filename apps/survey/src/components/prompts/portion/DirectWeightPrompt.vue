<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.directWeight.label') }} - {{ localDescription }}
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
import Vue, { VueConstructor } from 'vue';
import { merge } from '@intake24/common/util';
import { DirectWeightPromptProps, directWeightPromptDefaultProps } from '@intake24/common/prompts';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'DirectWeightPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => DirectWeightPromptProps,
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
    localeDescription(): string | null {
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
