<template>
  <prompt-layout
    v-bind="{
      actions,
      description: localeDescription,
      text: localeText,
      meal,
      food,
      isValid,
    }"
    @action="action"
  >
    <v-row>
      <v-col md="8" sm="12">
        <v-form ref="form" @submit.prevent="action('next')">
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
    </v-row>
    <template #actions>
      <v-btn
        :block="isMobile"
        class="px-5"
        large
        :title="$t('prompts.addMeal.no')"
        @click.stop="action('cancel')"
      >
        {{ $t('prompts.addMeal.no') }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-5"
        color="success"
        :disabled="!isValid"
        large
        :title="$t('prompts.addMeal.yes')"
        @click="action('next')"
      >
        {{ $t('prompts.addMeal.yes') }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :title="$t('prompts.addMeal.no')" value="cancel">
        <span class="text-overline font-weight-medium" @click="action('cancel')">
          {{ $t('prompts.addMeal.no') }}
        </span>
        <v-icon class="pb-1">$cancel</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn
        color="success"
        :disabled="!isValid"
        :title="$t('prompts.addMeal.yes')"
        value="next"
        @click="action('next')"
      >
        <span class="text-overline font-weight-medium">
          {{ $t('prompts.addMeal.yes') }}
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

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealAddPrompt',

  mixins: [createBasePrompt<BasePromptProps>()],

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
