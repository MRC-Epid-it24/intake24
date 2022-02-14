<template>
  <prompt-layout :text="promptText" :description="promptDescription">
    <v-col sm="10" xs="12" class="px-0 px-sm-3">
      <editable-food-list :food-list="foods" :drinks="false" ref="foodList" />
    </v-col>
    <v-col sm="10" xs="12" class="px-0 px-sm-3">
      <editable-food-list :food-list="drinks" :drinks="true" ref="drinksList" />
    </v-col>
    <template v-slot:actions>
      <confirm-dialog
        color="warning"
        :label="$t('prompts.editMeal.deleteMeal', { meal: mealName })"
        @confirm="removeMeal"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn :block="isMobile" class="px-5" large v-bind="attrs" v-on="on">
            {{ $t('prompts.editMeal.deleteMeal', { meal: mealName }) }}
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
        {{ $t('common.action.continue') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { FoodState } from '@intake24/common/types';
import { ConfirmDialog } from '@intake24/ui';
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

  components: { EditableFoodList, ConfirmDialog },

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    foodList: {
      type: Array as PropType<FoodState[]>,
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

    removeMeal() {
      this.$emit('abortMeal');
    },
  },
});
</script>
