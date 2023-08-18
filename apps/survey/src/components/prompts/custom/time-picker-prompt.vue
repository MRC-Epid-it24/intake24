<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2 time-picker-prompt">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-time-picker
          :format="prompt.format"
          full-width
          :landscape="$vuetify.breakpoint.smAndUp"
          :value="value"
          @input="update"
        ></v-time-picker>
        <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
      </v-form>
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')"></next-mobile>
    </template>
  </card-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'TimePickerPrompt',

  mixins: [createBasePrompt<'time-picker-prompt'>()],

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  emits: ['input'],

  computed: {
    isValid(): boolean {
      return !this.prompt.validation.required || !!this.value;
    },
  },

  methods: {
    update(value: string) {
      this.clearErrors();

      this.$emit('input', value);
    },

    confirm() {
      if (!this.prompt.validation.required || this.value) return true;

      this.errors = [
        this.translate(this.prompt.validation.message, {
          path: `prompts.${this.type}.validation.required`,
        }),
      ];
      return false;
    },
  },
});
</script>

<style lang="scss" scoped>
.time-picker-prompt {
  .v-time-picker-title {
    justify-content: center;
  }
}
</style>
