<template>
  <prompt-layout :text="promptText" :description="promptDescription">
    <v-col xs="12" sm="10" md="8" class="px-0 px-sm-3">
      <editable-food-list
        ref="editableFoodList"
        :food-list="foodList"
        :drinks="false"
        @food-added="onUpdate"
        @food-deleted="onUpdate"
      />
    </v-col>
    <template #actions>
      <confirm-dialog
        color="warning"
        :label="$t('prompts.editMeal.deleteMeal', { meal: getLocalMealName })"
        @confirm="onDeleteMeal"
      >
        <template #activator="{ on, attrs }">
          <v-btn :block="isMobile" class="px-5" large v-bind="attrs" v-on="on">
            {{ $t('prompts.editMeal.deleteMeal', { meal: getLocalMealName }) }}
          </v-btn>
        </template>
        {{ $t('prompts.mealDelete.message', { meal: getLocalMealName }) }}
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
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { FoodState, RequiredLocaleTranslation } from '@intake24/common/types';
import type { EditableFoodListType } from '@intake24/survey/components/prompts/standard/EditableFoodList.vue';
import BasePrompt from '@intake24/survey/components/prompts/BasePrompt';
import { ConfirmDialog } from '@intake24/ui';

import EditableFoodList from './EditableFoodList.vue';

const component = defineComponent({
  name: 'EditMealPrompt',

  components: { EditableFoodList, ConfirmDialog },

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
    foodList: {
      type: Array as PropType<FoodState[]>,
      required: true,
    },
    mealName: {
      type: Object as PropType<RequiredLocaleTranslation>,
      required: true,
    },
    continueEnabled: {
      type: Boolean,
      required: true,
    },
  },

  setup() {
    const editableFoodList = ref<EditableFoodListType>();

    return { editableFoodList };
  },

  computed: {
    getLocalMealName(): string {
      return this.getLocaleContent(this.mealName);
    },

    promptText(): string {
      return this.getLocaleContent(this.promptProps.text, {
        path: 'prompts.editMeal.text',
        params: { meal: this.getLocalMealName.toLocaleLowerCase() },
      });
    },

    promptDescription(): string {
      return this.getLocaleContent(this.promptProps.description, {
        path: 'prompts.editMeal.description',
      });
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
