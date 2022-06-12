<template>
  <prompt-layout :text="promptText" :description="promptDescription">
    <v-col sm="10" xs="12" md="8" lg="8" class="px-0 px-sm-3">
      <editable-food-list
        :food-list="foodList"
        :drinks="false"
        ref="foodList"
        @food-added="onUpdate"
        @food-deleted="onUpdate"
      />
    </v-col>
    <template v-slot:actions>
      <confirm-dialog
        color="warning"
        :label="$t('prompts.editMeal.deleteMeal', { meal: mealName })"
        @confirm="onDeleteMeal"
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
        :disabled="foodList.length === 0"
        :class="{ 'ml-2': !isMobile, 'mb-2': isMobile }"
        class="px-5"
        color="success"
        large
        @click="onContinue"
      >
        {{ $t('common.action.continue') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { mapActions, mapState } from 'pinia';
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

export interface EditMealPromptMethods {
  foodsDrinks(): FoodState[];
}

export default (Vue as VueConstructor<Vue & Prompt & Refs & EditMealPromptMethods>).extend({
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
  },

  methods: {
    onUpdate() {
      const editedFoods = this.$refs.foodList.editableList;
      this.$emit('update', editedFoods);
    },

    onContinue() {
      this.$emit('complete');
    },

    onDeleteMeal() {
      this.$emit('delete-meal');
    },

    foodsDrinks(): FoodState[] {
      return this.$refs.foodList.editableList;
    },
  },
});
</script>
