<template>
  <prompt-layout :text="promptText" :description="promptDescription">
    <v-col sm="10" xs="12" md="8" lg="8" class="px-0 px-sm-3">
      <editable-food-list
        :food-list="foodsDrinks"
        :drinks="false"
        ref="foodList"
        @food-added="onAdd"
        @food-deleted="onDelete"
      />
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
        :disabled="!continueComputedSwitch"
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
import { mapState } from 'pinia';
import { BasePromptProps } from '@intake24/common/prompts';
import { FoodState } from '@intake24/common/types';
import { ConfirmDialog } from '@intake24/ui';
import { useSurvey } from '@intake24/survey/stores';
import BasePrompt, { Prompt } from '@intake24/survey/components/prompts/BasePrompt';
import EditableFoodList, { HasEditableFoodList } from './EditableFoodList.vue';

type Refs = {
  $refs: {
    foodList: HasEditableFoodList;
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
    promptComponent: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState(useSurvey, ['selectedMealIndex', 'selectedFoodIndex', 'currentTempPromptAnswer']),

    promptText() {
      return this.getLocaleString(this.promptProps.text, 'prompts.editMeal.text', {
        meal: this.mealName.toLocaleLowerCase(),
      });
    },

    promptDescription() {
      return this.getLocaleString(this.promptProps.description, 'prompts.editMeal.description');
    },
    foodsDrinks(): FoodState[] {
      if (this.foodList.length > 0) return this.foodList;
      const tempFoodDrinks = this.currentTempPromptAnswer;
      if (
        tempFoodDrinks &&
        tempFoodDrinks.prompt === this.promptComponent &&
        tempFoodDrinks.mealIndex === this.selectedMealIndex &&
        tempFoodDrinks.response
      ) {
        return tempFoodDrinks.response as FoodState[];
      }
      return this.foodList;
    },
    continueComputedSwitch: {
      get(): boolean {
        const tempList = this.foodsDrinks as FoodState[];
        return tempList.length > 0;
      },
    },
  },

  methods: {
    onAdd(editableList: FoodState) {
      this.$emit('tempChanging', {
        response: editableList,
        modified: true,
        new: false,
        finished: true,
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        prompt: this.promptComponent,
      });
    },
    onDelete(value: number, editableList: FoodState) {
      this.$emit('tempChanging', {
        response: value === 0 ? null : editableList,
        modified: true,
        new: false,
        finished: !(value === 0),
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        prompt: this.promptComponent,
      });
    },
    submit() {
      const editedFoods = this.$refs.foodList.editableList;
      this.$emit('finishMeal', editedFoods);
    },

    removeMeal() {
      this.$emit('abortMeal');
    },
  },
});
</script>
