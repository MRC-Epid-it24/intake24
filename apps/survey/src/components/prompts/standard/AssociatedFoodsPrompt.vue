<template>
  <base-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-expansion-panels v-model="activePrompt" :tile="isMobile" @change="updatePrompts">
      <v-expansion-panel v-for="(prompt, index) in prompts" :key="index">
        <v-expansion-panel-header>
          {{ getLocaleContent(associatedFoodPrompts[index].promptText) }}
          <template #actions>
            <expansion-panel-actions :valid="isPromptValid(prompt)"></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="pl-0">
            <v-radio-group
              v-model="prompt.confirmed"
              :row="!isMobile"
              @change="onConfirmStateChanged(index)"
            >
              <v-radio
                :label="$t(`prompts.${type}.no`)"
                off-icon="fa-regular fa-circle"
                on-icon="$yes"
                value="no"
              ></v-radio>
              <v-radio
                :label="$t(`prompts.${type}.yes`)"
                off-icon="fa-regular fa-circle"
                on-icon="$yes"
                value="yes"
              ></v-radio>
              <v-radio
                v-if="prompt.confirmed === 'existing' || foodsAlreadyEntered[index] !== undefined"
                :label="$t(`prompts.${type}.alreadyEntered`)"
                off-icon="fa-regular fa-circle"
                on-icon="$yes"
                value="existing"
              ></v-radio>
            </v-radio-group>
          </v-container>
          <v-card v-if="prompt.confirmed === 'yes' && prompt.selectedFood !== undefined" flat>
            <v-card-text class="d-flex flex-column flex-md-row pa-0 gap-2">
              <v-alert class="flex-md-grow-1 mb-0" color="grey lighten-3">
                <v-icon left>$ok</v-icon>
                {{ prompt.selectedFood.name }}
              </v-alert>
              <v-btn color="secondary" large outlined @click="selectDifferentFood(prompt)">
                {{ $t(`prompts.${type}.select.different`) }}
              </v-btn>
            </v-card-text>
          </v-card>
          <v-expand-transition>
            <v-card v-show="prompt.confirmed === 'yes' && prompt.selectedFood === undefined" flat>
              <food-browser
                v-bind="{ localeId, rootCategory: associatedFoodPrompts[index].categoryCode, type }"
                @food-missing="foodMissing(index)"
                @food-selected="(food) => foodSelected(food, index)"
              ></food-browser>
            </v-card>
          </v-expand-transition>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { AssociatedFoodPromptItemState, PromptStates } from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/types';
import type { FoodHeader, UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import { ExpansionPanelActions, FoodBrowser } from '@intake24/survey/components/elements';
import { useLocale } from '@intake24/ui';

import createBasePrompt from '../createBasePrompt';

const isPromptValid = (prompt: AssociatedFoodPromptItemState): boolean =>
  (prompt.confirmed && ['no', 'existing', 'missing'].includes(prompt.confirmed)) ||
  (prompt.confirmed === 'yes' && prompt.selectedFood !== undefined);

const getNextPrompt = (prompts: AssociatedFoodPromptItemState[]) =>
  prompts.findIndex((prompt) => !isPromptValid(prompt));

export default defineComponent({
  name: 'AssociatedFoodsPrompt',

  components: { ExpansionPanelActions, FoodBrowser },

  mixins: [createBasePrompt<'associated-foods-prompt'>()],

  props: {
    initialState: {
      type: Object as PropType<PromptStates['associated-foods-prompt']>,
      required: true,
    },
    food: {
      type: Object as PropType<EncodedFood>,
      required: true,
    },
    localeId: {
      type: String,
      required: true,
    },
  },

  emits: ['update'],

  setup(props) {
    const { getLocaleContent } = useLocale();

    const activePrompt = ref(props.initialState.activePrompt);
    const prompts = ref(props.initialState.prompts);
    const usedExistingFoodIds = ref<string[]>([]);

    return { activePrompt, prompts, usedExistingFoodIds, getLocaleContent };
  },

  computed: {
    foodsAlreadyEntered(): (string | undefined)[] {
      const foodsInThisMeal = this.meal?.foods ?? [];

      return this.associatedFoodPrompts.map((prompt) => {
        for (const food of foodsInThisMeal) {
          // Don't link food to itself
          if (food.id === this.food.id) continue;

          // Rare corner case: two or more prompts from the same food refer to the same
          // food or category
          if (this.usedExistingFoodIds.includes(food.id)) continue;

          // Don't allow linking foods that have linked foods of their own
          if (food.linkedFoods.length) continue;

          if (
            prompt.foodCode !== undefined &&
            food.type === 'encoded-food' &&
            food.data.code === prompt.foodCode
          )
            return food.id;

          if (
            prompt.categoryCode !== undefined &&
            food.type === 'encoded-food' &&
            food.data.categories.includes(prompt.categoryCode)
          )
            return food.id;
        }

        return undefined;
      });
    },

    associatedFoodPrompts(): UserAssociatedFoodPrompt[] {
      return this.food.data.associatedFoodPrompts;
    },

    isValid(): boolean {
      return this.prompts.every(isPromptValid);
    },
  },

  methods: {
    isPromptValid,

    goToNextIfCan(index: number) {
      if (!isPromptValid(this.prompts[index])) return;

      this.activePrompt = getNextPrompt(this.prompts);
    },

    onConfirmStateChanged(index: number) {
      if (this.prompts[index].confirmed === 'existing') {
        const foodId = this.foodsAlreadyEntered[index];

        if (foodId !== undefined) {
          this.prompts.splice(index, 1, {
            confirmed: 'existing',
            existingFoodId: foodId,
            selectedFood: this.prompts[index].selectedFood,
          });

          this.usedExistingFoodIds.push(foodId);
        }
      } else {
        const existingFoodId = this.prompts[index].existingFoodId;

        if (existingFoodId !== undefined) {
          this.usedExistingFoodIds = this.usedExistingFoodIds.filter((id) => id !== existingFoodId);
        }

        const { foodCode, genericName } = this.associatedFoodPrompts[index];

        const selectedFood =
          this.prompts[index].confirmed === 'yes' && foodCode
            ? { code: foodCode, name: this.getLocaleContent(genericName) }
            : this.prompts[index].selectedFood;

        this.prompts.splice(index, 1, { confirmed: this.prompts[index].confirmed, selectedFood });
      }

      this.goToNextIfCan(index);
      this.updatePrompts();
    },

    selectDifferentFood(prompt: AssociatedFoodPromptItemState) {
      prompt.selectedFood = undefined;

      this.updatePrompts();
    },

    foodSelected(food: FoodHeader, promptIndex: number): void {
      this.prompts.splice(promptIndex, 1, { confirmed: 'yes', selectedFood: food });

      this.goToNextIfCan(promptIndex);
      this.updatePrompts();
    },

    foodMissing(promptIndex: number) {
      this.prompts.splice(promptIndex, 1, { confirmed: 'missing' });

      this.goToNextIfCan(promptIndex);
      this.updatePrompts();
    },

    updatePrompts() {
      const { activePrompt, prompts } = this;

      this.$emit('update', { state: { activePrompt, prompts } });
    },
  },
});
</script>

<style lang="scss" scoped></style>
