<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-col class="px-0 px-sm-3" cols="12" md="8" sm="10">
      <editable-food-list v-model="foods" @input="update"></editable-food-list>
    </v-col>
    <template #actions>
      <v-btn
        :block="isMobile"
        class="px-4"
        :class="{ 'mr-2': !isMobile }"
        color="secondary"
        large
        text
        :title="$t('recall.actions.mealTime')"
        @click="action('mealTime', meal.id)"
      >
        <v-icon left>fas fa-clock</v-icon>
        {{ $t('recall.actions.mealTime') }}
      </v-btn>
      <confirm-dialog
        :label="$t(`prompts.${type}.delete._`, { meal: localMealName }).toString()"
        @confirm="action('deleteMeal', meal.id)"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            :block="isMobile"
            class="px-4"
            :class="{ 'mr-2': !isMobile }"
            color="secondary"
            large
            text
            :title="$t('recall.actions.deleteMeal')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon left>$delete</v-icon>
            {{ $t('recall.actions.nav.deleteMeal') }}
          </v-btn>
        </template>
        {{ $t(`prompts.${type}.delete.confirm`, { item: localMealName }) }}
      </confirm-dialog>
      <next
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        :disabled="!isValid"
        @click="action('next')"
      ></next>
    </template>
    <template #nav-actions>
      <v-btn
        large
        :title="$t('recall.actions.nav.mealTime')"
        @click.stop="action('mealTime', meal.id)"
      >
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.mealTime') }}
        </span>
        <v-icon class="pb-1">fas fa-clock</v-icon>
      </v-btn>
      <confirm-dialog
        :label="$t(`prompts.${type}.delete._`, { item: localMealName }).toString()"
        @confirm="action('deleteMeal', meal.id)"
      >
        <template #activator="{ on, attrs }">
          <v-btn value="deleteMeal" v-bind="attrs" v-on="on">
            <span class="text-overline font-weight-medium">
              {{ $t('recall.actions.nav.deleteMeal') }}
            </span>
            <v-icon class="pb-1">$delete</v-icon>
          </v-btn>
        </template>
        {{ $t(`prompts.${type}.delete.confirm`, { item: localMealName }) }}
      </confirm-dialog>
      <v-btn color="secondary" :disabled="!isValid" value="next" @click.stop="action('next')">
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

  mixins: [createBasePrompt<'edit-meal-prompt'>()],

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

  emits: ['update'],

  data() {
    return { ...copy(this.initialState) };
  },

  computed: {
    localMealName(): string {
      return this.getLocaleContent(this.meal.name);
    },

    isValid() {
      return !!this.foods.length;
    },
  },

  methods: {
    update() {
      const { foods } = this;
      const state: EditMealPromptState = { foods };

      this.$emit('update', { state });
    },
  },
});
</script>
