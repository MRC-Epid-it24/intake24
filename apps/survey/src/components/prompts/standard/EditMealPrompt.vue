<template>
  <prompt-layout :text="promptText" :description="promptDescription">
    <v-col xs="12" sm="10" md="8" class="px-0 px-sm-3">
      <editable-food-list
        :food-list="foodList"
        :drinks="false"
        ref="editableFoodList"
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
        :disabled="!continueEnabled"
        :class="{ 'ml-2': !isMobile, 'mb-2': isMobile }"
        color="success"
        class="px-5"
        large
        @click="onContinue"
      >
        {{ $t('common.action.continue') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import type { BasePromptProps } from '@intake24/common/prompts';
import type { FoodState } from '@intake24/common/types';
import { ConfirmDialog } from '@intake24/ui';
import { useSurvey } from '@intake24/survey/stores';
import BasePrompt from '@intake24/survey/components/prompts/BasePrompt';
import EditableFoodList from './EditableFoodList.vue';
import type { EditableFoodListType } from '@intake24/survey/components/prompts/standard/EditableFoodList.vue';

const component = defineComponent({
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
    continueEnabled: {
      type: Boolean,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
  },

  setup() {
    const editableFoodList = ref<EditableFoodListType>();

    return { editableFoodList };
  },

  computed: {
    promptText(): string {
      return this.getLocaleString(this.promptProps.text, 'prompts.editMeal.text', {
        meal: this.mealName.toLocaleLowerCase(),
      });
    },

    promptDescription(): string {
      return this.getLocaleString(this.promptProps.description, 'prompts.editMeal.description');
    },
  },

  methods: {
    onUpdate() {
      const editedFoods = this.editableFoodList?.editableList;
      this.$emit('update', { foods: editedFoods });
    },

    onContinue() {
      this.$emit('continue');
    },

    onDeleteMeal() {
      this.$emit('delete-meal');
    },

    foodsDrinks(): FoodState[] {
      return this.editableFoodList!.editableList;
    },
  },
});

export default component;

export type EditMealPromptType = InstanceType<typeof component>;
</script>
