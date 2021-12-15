<template>
  <prompt-layout :text="text" :description="description">
    <v-form ref="form" @submit.prevent="submit">
      <v-time-picker
        v-model="currentValue"
        :format="promptProps.format"
        :landscape="!isMobile"
        full-width
        @input="clearErrors"
      ></v-time-picker>
      <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
    </v-form>
    <template v-slot:actions>
      <confirm-dialog
        color="warning"
        :label="$t('prompts.editMeal.deleteMeal', { meal: mealName })"
        @confirm="removeMeal"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn :block="isMobile" class="px-5" large v-bind="attrs" v-on="on">
            {{ $t('prompts.mealTime.no', { meal: mealName }) }}
          </v-btn>
        </template>
        {{ $t('prompts.mealDelete.message', { meal: mealName }) }}
      </confirm-dialog>
      <v-btn
        :block="isMobile"
        :class="{ 'ml-2': !isMobile, 'mb-2': isMobile }"
        class="px-5"
        color="success"
        large
        @click="submit"
      >
        {{ $t('prompts.mealTime.yes', { meal: mealName }) }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { MealTimePromptProps } from '@common/prompts';
import BasePrompt, { Prompt } from '../BasePrompt';
import ConfirmDialog from '@/components/elements/ConfirmDialog.vue';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'MealTimePrompt',

  components: { ConfirmDialog },

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as () => MealTimePromptProps,
    },
    mealName: {
      type: String,
    },
    value: {
      type: String,
      default: null,
    },
    submitTrigger: {
      type: Boolean,
    },
  },

  data() {
    return {
      currentValue: this.value,
      validation: this.promptProps.validation,
      errors: [] as string[],
    };
  },

  computed: {
    hasErrors(): boolean {
      return !!this.errors.length;
    },
    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      return text
        ? text.replace('{meal}', this.mealName ?? '')
        : this.$t('prompts.mealTime.text', { meal: this.mealName }).toString();
    },
    description(): string {
      const description = this.promptProps.description[this.$i18n.locale];
      return description
        ? description.replace('{meal}', this.mealName ?? '')
        : this.$t('prompts.mealTime.description', { meal: this.mealName }).toString();
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    removeMeal() {
      this.$emit('removeMeal');
    },

    submit() {
      if (this.validation.required && !this.currentValue) {
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            this.$t('prompts.mealTime.validation.required').toString(),
        ];
        return;
      }

      this.$emit('answer', this.currentValue);
    },
  },
  watch: {
    submitTrigger: {
      handler(trigger: boolean) {
        if (trigger) this.submit();
      },
      deep: false,
      immediate: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
