<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template v-if="prompt.separateDrinks">
      <editable-food-list
        v-model="foodsOnly"
        v-bind="{ prompt }"
        focus
        mode="foodsOnly"
        @input="update"
      ></editable-food-list>
      <editable-food-list
        v-bind="{ prompt }"
        v-model="drinksOnly"
        mode="drinksOnly"
        @input="update"
      ></editable-food-list>
    </template>
    <editable-food-list
      v-else
      v-bind="{ prompt }"
      v-model="foods"
      focus
      @input="update"
    ></editable-food-list>
    <template #actions>
      <v-btn
        class="px-4"
        color="primary"
        large
        text
        :title="$t('recall.actions.mealTime')"
        @click="action('mealTime', meal.id)"
      >
        <v-icon left>fas fa-clock</v-icon>
        {{ $t('recall.actions.mealTime') }}
      </v-btn>
      <confirm-dialog
        :label="$t('recall.menu.meal.delete').toString()"
        @confirm="action('deleteMeal', meal.id)"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            class="px-4"
            color="primary"
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
        {{ $t('recall.menu.confirmDelete', { item: mealName }) }}
      </confirm-dialog>
      <next :disabled="!isValid" @click="action('next')"></next>
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
        :label="$t('recall.menu.meal.delete').toString()"
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
        {{ $t('recall.menu.confirmDelete', { item: mealName }) }}
      </confirm-dialog>
      <v-btn color="primary" :disabled="!isValid" value="next" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.next') }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { FoodState, MealState } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { useMealUtils } from '@intake24/survey/composables';
import { ConfirmDialog } from '@intake24/ui';

import createBasePrompt from '../createBasePrompt';
import { EditableFoodList } from '../partials';

export default defineComponent({
  name: 'EditMealPrompt',

  components: { EditableFoodList, ConfirmDialog },

  mixins: [createBasePrompt<'edit-meal-prompt'>()],

  props: {
    initialState: {
      type: Object as PropType<PromptStates['edit-meal-prompt']>,
      required: true,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
  },

  emits: ['update'],

  setup(props) {
    const { translate } = useI18n();
    const { mealName } = useMealUtils(props);

    return { translate, mealName };
  },

  data() {
    return { ...copy(this.initialState) };
  },

  computed: {
    drinksOnly: {
      get() {
        return this.foods.filter((food) => food.flags.includes('is-drink'));
      },
      set(val: FoodState[]) {
        this.foods = [...this.foodsOnly, ...val];
      },
    },

    foodsOnly: {
      get() {
        return this.foods.filter((food) => !food.flags.includes('is-drink'));
      },
      set(val: FoodState[]) {
        this.foods = [...this.drinksOnly, ...val];
      },
    },

    isValid() {
      return !!this.foods.length;
    },
  },

  methods: {
    update() {
      const { foods } = this;
      const state: PromptStates['edit-meal-prompt'] = { foods };

      this.$emit('update', { state });
    },
  },
});
</script>
