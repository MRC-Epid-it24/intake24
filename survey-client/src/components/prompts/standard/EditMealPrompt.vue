<template>
  <prompt-layout :text="text" :description="description">
    <v-col md="8" sm="12">
      <v-form ref="form" @submit.prevent="submit">
        <v-list flat dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-text-field
                  v-model="currentValue"
                  id="newFood"
                  name="newFood"
                  label="Type food name"
                  @keyup.enter="addFood"
                  outlined
                />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item-group>
            <v-list-item v-for="(food, idx) in foodsList" :key="idx">
              <v-list-item-content>
                <v-list-item-title v-text="foodDisplayName(food)"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-form>
    </v-col>
    <template v-slot:actions>
      <v-btn :block="isMobile" class="px-5" large @click="abortMeal">
        {{ no }}
      </v-btn>
      <v-btn
        :block="isMobile"
        :class="{ 'ma-0': isMobile, 'mb-2': isMobile }"
        class="px-5"
        color="success"
        large
        @click="submit"
      >
        {{ yes }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { BasePromptProps, editMealPromptProps } from '@common/prompts';
import { FoodState } from '@common/types';
import BasePrompt from '../BasePrompt';

export default Vue.extend({
  name: 'EditMealPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
    },
    list: {
      type: Array as () => FoodState[],
    },
    mealName: {
      type: String,
    },
  },

  data() {
    return {
      currentValue: '',
    };
  },

  // FIXME: Rewrite the logic in text, description, yes and no computed values to decouple similar code
  computed: {
    foodsList(): FoodState[] {
      return this.list;
    },
    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      return text
        ? text.replace('{meal}', this.mealName ?? '')
        : (this.$t('prompts.editMeal.text') as string).replace('{meal}', this.mealName ?? '');
    },
    description(): string {
      const description = this.promptProps.description[this.$i18n.locale];
      return description
        ? description.replace('{meal}', this.mealName ?? '')
        : (this.$t('prompts.editMeal.description') as string).replace(
            '{meal}',
            this.mealName ?? ''
          );
    },
    yes(): string {
      const yes = this.$t('prompts.editMeal.yes') as string;
      return yes.replace('{meal}', this.mealName ?? '');
    },
    no(): string {
      const no = this.$t('prompts.editMeal.no') as string;
      return no.replace('{meal}', this.mealName ?? '');
    },
  },

  methods: {
    submit() {
      // this.$emit('finishMeal');
    },

    abortMeal() {
      this.$emit('abortMeal');
    },

    addFood() {
      this.$emit('addFood', this.currentValue);
      this.currentValue = '';
    },

    foodDisplayName(food: FoodState): string {
      if (food.type === 'free-text') return food.description;
      if (food.type === 'encoded-food') return food.data.localDescription;

      return '???';
    },
  },
});
</script>

<style lang="scss" scoped></style>
