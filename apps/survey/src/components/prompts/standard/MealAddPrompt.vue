<template>
  <prompt-layout
    v-bind="{
      description: localeDescription,
      text: localeText,
      meal,
      food,
      isValid,
    }"
  >
    <v-col md="8" sm="12">
      <v-form ref="form" @submit.prevent="navAction('next')">
        <v-combobox
          v-model="currentValue"
          autofocus
          clearable
          hide-selected
          :hint="$t('prompts.addMeal.hint')"
          :items="meals"
          :label="$t('prompts.addMeal.label')"
          outlined
          persistent-hint
          small-chips
          @change="update"
        >
        </v-combobox>
      </v-form>
    </v-col>
    <template #actions>
      <continue
        :disabled="!isValid"
        :label="$t('prompts.addMeal.yes')"
        @click="navAction('next')"
      ></continue>
    </template>
    <template #nav-actions>
      <v-btn value="cancel">
        <span class="text-overline font-weight-medium" @click="navAction('cancel')">
          {{ $t('common.action.cancel') }}
        </span>
        <v-icon class="pb-1">$cancel</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn color="success" :disabled="!isValid" value="next" @click="navAction('next')">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.continue') }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import { mealAddPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'MealAddPrompt',

  mixins: [BasePrompt],

  props: {
    promptComponent: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    meals: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(mealAddPromptProps, this.promptProps),
      currentValue: undefined as string | undefined,
    };
  },

  computed: {
    localeText(): string {
      return this.getLocaleContent(this.text, { path: 'prompts.addMeal.text' });
    },

    localeDescription(): string {
      return this.getLocaleContent(this.description, { path: 'prompts.addMeal.description' });
    },

    isValid() {
      return !!this.currentValue;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: this.currentValue, valid: this.isValid });
    },
  },
});
</script>

<style lang="scss" scoped></style>
