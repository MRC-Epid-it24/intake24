<template>
  <prompt-layout
    v-bind="{ actions, description: promptDescription, text: promptText, food, meal, isValid }"
    @action="action"
  >
    <v-col class="px-0 px-sm-3" cols="12" md="8" sm="10">
      <editable-food-list v-model="foods" @input="update"></editable-food-list>
    </v-col>
    <template #actions>
      <confirm-dialog
        color="warning"
        :label="$t('prompts.editMeal.delete._', { meal: localMealName }).toString()"
        @confirm="action('deleteMeal', meal?.id)"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            :block="isMobile"
            class="px-5"
            :class="{ 'mr-2': !isMobile }"
            color="error"
            large
            :title="$t('recall.actions.deleteMeal')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon left>$delete</v-icon>
            {{ $t('prompts.editMeal.delete._', { item: localMealName }) }}
          </v-btn>
        </template>
        {{ $t('prompts.editMeal.delete.confirm', { item: localMealName }) }}
      </confirm-dialog>
      <next
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        :disabled="!isValid"
        @click="action('next')"
      ></next>
    </template>
    <template #nav-actions>
      <confirm-dialog
        color="warning"
        :label="$t('prompts.editMeal.delete._', { item: localMealName }).toString()"
        @confirm="action('deleteMeal', meal?.id)"
      >
        <template #activator="{ on, attrs }">
          <v-btn color="error" value="deleteMeal" v-bind="attrs" v-on="on">
            <span class="text-overline font-weight-medium">
              {{ $t('recall.actions.nav.deleteMeal') }}
            </span>
            <v-icon class="pb-1">$delete</v-icon>
          </v-btn>
        </template>
        {{ $t('prompts.editMeal.delete.confirm', { item: localMealName }) }}
      </confirm-dialog>
      <v-btn color="success" :disabled="!isValid" value="next" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.next') }}
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
import type { FoodState, MealState } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { ConfirmDialog } from '@intake24/ui';

import createBasePrompt from '../createBasePrompt';
import EditableFoodList from './EditableFoodList.vue';

export type EditMealPromptState = {
  foods: FoodState[];
};

export default defineComponent({
  name: 'EditMealPrompt',

  components: { EditableFoodList, ConfirmDialog },

  mixins: [createBasePrompt<BasePromptProps>()],

  props: {
    initialState: {
      type: Object as PropType<EditMealPromptState>,
      required: true,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
  },

  data() {
    return { ...copy(this.initialState) };
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
    update() {
      const { foods } = this;
      const state: EditMealPromptState = { foods };

      this.$emit('update', { state, valid: this.isValid });
    },
  },
});
</script>
