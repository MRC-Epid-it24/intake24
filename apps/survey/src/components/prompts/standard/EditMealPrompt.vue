<template>
  <prompt-layout :text="promptText" :description="promptDescription">
    <v-col sm="10" xs="12" class="px-0 px-sm-3">
      <editable-food-list :food-list="foods" :drinks="false" ref="foodList" />
    </v-col>
    <v-col sm="10" xs="12" class="px-0 px-sm-3">
      <editable-food-list :food-list="drinks" :drinks="true" ref="drinksList" />
    </v-col>
    <template v-slot:actions>
      <v-btn :block="isMobile" class="px-5" large @click="deleteMeal">
        {{ $t('prompts.editMeal.deleteMeal', { meal: mealName }) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        :class="{ 'ma-0': isMobile, 'mb-2': isMobile }"
        class="px-5"
        color="success"
        large
        @click="submit"
      >
        {{ $t('common.continue') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { BasePromptProps } from '@common/prompts';
import { FoodState } from '@common/types';
import EditableFoodList, { HasEditableFoodList } from './EditableFoodList.vue';
import BasePrompt, { Prompt } from '../BasePrompt';

type Refs = {
  $refs: {
    foodList: HasEditableFoodList;
    drinksList: HasEditableFoodList;
  };
};

export default (Vue as VueConstructor<Vue & Prompt & Refs>).extend({
  name: 'EditMealPrompt',
  components: { EditableFoodList },
  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
      required: true,
    },
    foodList: {
      type: Array as () => FoodState[],
      required: true,
    },
    mealName: {
      type: String,
      required: true,
    },
  },

  computed: {
    promptText() {
      return this.getLocaleString(this.promptProps.text, 'prompts.editMeal.text', {
        meal: this.mealName.toLocaleLowerCase(),
      });
    },

    promptDescription() {
      return this.getLocaleString(this.promptProps.description, 'prompts.editMeal.description');
    },

    foods() {
      return this.foodList.filter((food) => !food.flags.includes('is-drink'));
    },

    drinks() {
      return this.foodList.filter((food) => food.flags.includes('is-drink'));
    },
  },

  methods: {
    submit() {
      const editedFoods = this.$refs.foodList.editableList;
      const editedMeals = this.$refs.drinksList.editableList;

      this.$emit('finishMeal', editedFoods.concat(editedMeals));
    },

    deleteMeal() {
      this.$emit('abortMeal');
    },
  },
});
</script>
