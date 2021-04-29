<template>
  <prompt-layout :text="text" :description="description">
    <v-col md="8" sm="12">
      <v-form ref="form" @submit.prevent="submit">
        <v-list>
          <v-list-item
            :ripple="false"
            v-for="(food, idx) in editableList"
            :key="idx"
            @click="edit(idx)"
          >
            <v-text-field
              v-if="editIndex === idx"
              v-model="editableList[idx].description"
              ref="textField"
              @keypress.enter.stop="addFood"
              @focusout="onEditFocusLost"
            ></v-text-field>
            <v-list-item-icon v-if="editIndex === idx"
              ><v-btn icon @click="deleteFood()"><v-icon>fa-trash</v-icon></v-btn></v-list-item-icon
            >
            <v-list-item-title v-else v-text="foodDisplayName(food)"></v-list-item-title>
          </v-list-item>
        </v-list>
        <v-btn v-if="editIndex == null" icon x-large @click="addFood"
          ><v-icon>fa-edit</v-icon></v-btn
        >
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
import { clone } from 'lodash';
import BasePrompt from '../BasePrompt';

export default Vue.extend({
  name: 'EditMealPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
    },
    foodList: {
      type: Array as () => FoodState[],
    },
    mealName: {
      type: String,
    },
  },

  data() {
    return {
      editableList: clone(this.foodList),
      newFoodDescription: '',
      editIndex: null as number | null,
    };
  },

  // FIXME: Rewrite the logic in text, description, yes and no computed values to decouple similar code
  computed: {
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
    edit(index: number) {
      this.editIndex = index;

      this.$nextTick(() => {
        // FIXME: must be a better way to avoid type errors
        const textField = this.$refs.textField as HTMLInputElement[];
        textField[0].focus();
      });
    },

    submit() {
      this.$emit(
        'finishMeal',
        this.editableList.filter(
          (entry) => entry.type !== 'free-text' || entry.description.trim().length > 0
        )
      );
    },

    abortMeal() {
      this.$emit('abortMeal');
    },

    addFood() {
      if (this.editIndex != null) {
        const editEntry = this.editableList[this.editIndex];

        if (editEntry.type === 'free-text' && editEntry.description.trim().length === 0) return;
      }

      this.editableList.push({
        type: 'free-text',
        description: this.newFoodDescription,
        flags: [],
        customPromptAnswers: {},
      });

      this.edit(this.editableList.length - 1);
    },

    deleteFood() {
      if (this.editIndex != null) {
        this.editableList.splice(this.editIndex, 1);
        this.editIndex = null;
      }
    },

    onEditFocusLost() {
      if (this.editIndex != null) {
        const editEntry = this.editableList[this.editIndex];
        if (editEntry.type === 'free-text' && editEntry.description.trim().length === 0)
          this.deleteFood();
      }
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
