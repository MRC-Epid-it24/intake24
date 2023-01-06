<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-row>
      <v-col md="8" sm="12">
        <v-form ref="form" @submit.prevent="action('next')">
          <v-combobox
            v-model="currentValue"
            autofocus
            clearable
            hide-selected
            :hint="$t(`prompts.${type}.hint`)"
            :items="meals"
            :label="$t(`prompts.${type}.label`)"
            outlined
            persistent-hint
            small-chips
            @change="update"
          >
          </v-combobox>
        </v-form>
      </v-col>
    </v-row>
    <template #actions>
      <v-btn
        :block="isMobile"
        class="px-5"
        large
        :title="$t(`prompts.${type}.no`)"
        @click.stop="action('cancel')"
      >
        {{ $t(`prompts.${type}.no`) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-5"
        color="success"
        :disabled="!isValid"
        large
        :title="$t(`prompts.${type}.yes`)"
        @click="action('next')"
      >
        {{ $t(`prompts.${type}.yes`) }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :title="$t(`prompts.${type}.no`)" value="cancel">
        <span class="text-overline font-weight-medium" @click="action('cancel')">
          {{ $t(`prompts.${type}.no`) }}
        </span>
        <v-icon class="pb-1">$cancel</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn
        color="success"
        :disabled="!isValid"
        :title="$t(`prompts.${type}.yes`)"
        value="next"
        @click="action('next')"
      >
        <span class="text-overline font-weight-medium">
          {{ $t(`prompts.${type}.yes`) }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealAddPrompt',

  mixins: [createBasePrompt<'meal-add-prompt'>()],

  props: {
    meals: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  data() {
    return {
      currentValue: undefined as string | undefined,
    };
  },

  computed: {
    isValid() {
      return !!this.currentValue;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: this.currentValue });
    },
  },
});
</script>

<style lang="scss" scoped></style>
