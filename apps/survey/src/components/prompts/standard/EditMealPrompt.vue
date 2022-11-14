<template>
  <prompt-layout
    v-bind="{ description: promptDescription, text: promptText, food, meal, isValid }"
    @nav-action="navAction"
  >
    <v-col class="px-0 px-sm-3" cols="12" md="8" sm="10">
      <editable-food-list v-model="foods" @input="update"></editable-food-list>
    </v-col>
    <template v-if="!isMobile" #actions>
      <confirm-dialog
        color="warning"
        :label="$t('prompts.editMeal.deleteMeal', { meal: localMealName }).toString()"
        @confirm="removeMeal"
      >
        <template #activator="{ on, attrs }">
          <v-btn :block="isMobile" class="px-5" large v-bind="attrs" v-on="on">
            {{ $t('prompts.editMeal.deleteMeal', { meal: localMealName }) }}
          </v-btn>
        </template>
        {{ $t('prompts.mealDelete.message', { meal: localMealName }) }}
      </confirm-dialog>
      <v-btn
        :block="isMobile"
        class="px-5"
        :class="{ 'ml-2': !isMobile, 'mb-2': isMobile }"
        color="success"
        :disabled="!isValid"
        large
        @click="navAction('next')"
      >
        {{ $t('common.action.continue') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { FoodState, MealState } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import BasePrompt from '@intake24/survey/components/prompts/BasePrompt';
import { ConfirmDialog } from '@intake24/ui';

import EditableFoodList from './EditableFoodList.vue';

export type EditMealPromptState = {
  foods: FoodState[];
};

export default defineComponent({
  name: 'EditMealPrompt',

  components: { EditableFoodList, ConfirmDialog },

  mixins: [BasePrompt],

  props: {
    initialState: {
      type: Object as PropType<EditMealPromptState>,
      required: true,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...copy(this.initialState),
    };
  },

  computed: {
    localMealName(): string {
      return this.getLocaleContent(this.meal.name);
    },

    promptText(): string {
      return this.getLocaleContent(this.promptProps.text, {
        path: 'prompts.editMeal.text',
        params: { meal: this.localMealName.toLocaleLowerCase() },
      });
    },

    promptDescription(): string {
      return this.getLocaleContent(this.promptProps.description, {
        path: 'prompts.editMeal.description',
      });
    },

    isValid() {
      return !!this.foods.length;
    },
  },

  methods: {
    removeMeal() {
      this.$emit('remove-meal');
    },

    update() {
      const { foods } = this;
      const state: EditMealPromptState = { foods };

      this.$emit('update', { state, valid: this.isValid });
    },
  },
});
</script>
