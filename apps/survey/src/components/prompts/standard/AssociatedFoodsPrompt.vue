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
          <v-container class="pa-0">
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
                v-if="prompt.confirmed === 'existing' || availableFoods[index].length > 0"
                :label="getAlreadyEnteredLabel(index)"
                off-icon="fa-regular fa-circle"
                on-icon="$yes"
                value="existing"
              ></v-radio>
            </v-radio-group>
          </v-container>
          <v-card
            v-if="prompt.confirmed === 'yes' && prompt.selectedFood !== undefined"
            class="pa-1"
            flat
          >
            <v-card-text class="d-flex flex-column flex-md-row pa-0 food-selection">
              <v-container>
                <v-row align="baseline">
                  <v-alert class="flex-md-grow-1 mr-2" color="grey lighten-3">
                    <v-icon left>$ok</v-icon>
                    {{ prompt.selectedFood.description }}
                  </v-alert>
                  <v-btn
                    class="mr-2"
                    color="secondary"
                    outlined
                    @click="selectDifferentFood(prompt)"
                  >
                    {{ $t(`prompts.${type}.select.different`) }}
                  </v-btn>
                  <v-btn color="secondary" outlined>
                    {{ $t(`prompts.${type}.select.remove`) }}
                  </v-btn>
                </v-row>
              </v-container>
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

          <v-expand-transition>
            <v-card
              v-show="
                prompt.confirmed === 'existing' &&
                prompt.existingFoodId === undefined &&
                availableFoods[index].length > 1
              "
              flat
            >
              <v-card-title>Which one of these?</v-card-title>
              <v-card-text>
                <meal-food-chooser
                  v-if="meal"
                  :filter="(food) => availableFoods[index].includes(food)"
                  :meal-id="meal.id"
                  @selected="(food) => existingFoodSelected(food, index)"
                ></meal-food-chooser>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref, set, watch } from 'vue';

import type { AssociatedFoodPromptItemState, PromptStates } from '@intake24/common/prompts';
import type { EncodedFood, FoodState } from '@intake24/common/types';
import type { FoodHeader, UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import { getFoodDisplayText } from '@intake24/common/types';
import { ExpansionPanelActions, FoodBrowser } from '@intake24/survey/components/elements';
import MealFoodChooser from '@intake24/survey/components/prompts/partials/MealFoodChooser.vue';
import { useLocale } from '@intake24/ui';

import createBasePrompt from '../createBasePrompt';

const isPromptValid = (prompt: AssociatedFoodPromptItemState): boolean =>
  (prompt.confirmed && ['no', 'existing', 'missing'].includes(prompt.confirmed)) ||
  (prompt.confirmed === 'yes' && prompt.selectedFood !== undefined);

const getNextPrompt = (prompts: AssociatedFoodPromptItemState[]) =>
  prompts.findIndex((prompt) => !isPromptValid(prompt));

export default defineComponent({
  name: 'AssociatedFoodsPrompt',

  components: { MealFoodChooser, ExpansionPanelActions, FoodBrowser },

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

    const foods = ref(props.meal?.foods);

    // Corner case: an existing food id becomes invalid if the food is removed from the meal
    // before the associated food prompt is completed.

    // FIXME
    //
    // This seems to depend on food order for some reason.
    //
    // For example, when entering soup, toast, identifying toast, then moving to soup, selecting
    // toast as existing food reference, then deleting toast it works.
    //
    // But if done the exact same way except for enterint toast before soup the watch doesn't
    // trigger.
    watch(
      foods,
      (newFoods) => {
        for (let i = 0; i < prompts.value.length; ++i) {
          const prompt = prompts.value[i];
          if (
            prompt.confirmed === 'existing' &&
            prompt.existingFoodId !== undefined &&
            (!newFoods || !newFoods.some((food) => food.id === prompt.existingFoodId))
          ) {
            const updatedPrompt = {
              ...prompt,
              confirmed: undefined,
              existingFoodId: undefined,
            };

            set(prompts.value, i, updatedPrompt);
          }
        }
      },
      { deep: true }
    );

    return { activePrompt, prompts, getLocaleContent };
  },

  computed: {
    associatedFoodPrompts(): UserAssociatedFoodPrompt[] {
      return this.food.data.associatedFoodPrompts;
    },

    isValid(): boolean {
      return this.prompts.every(isPromptValid);
    },

    usedExistingFoodIds(): string[] {
      return this.prompts
        .filter((prompt) => prompt.confirmed === 'existing' && prompt.existingFoodId)
        .map((prompt) => prompt.existingFoodId!);
    },

    availableFoods(): string[][] {
      const foodsInThisMeal = this.meal?.foods ?? [];

      return this.associatedFoodPrompts.map((prompt) => {
        const availableFoods: string[] = [];

        for (const food of foodsInThisMeal) {
          // Don't link food to itself
          if (food.id === this.food.id) continue;

          // Don't allow linking foods that have linked foods of their own
          if (food.linkedFoods.length) continue;

          // Don't allow two or more prompts to refer to the same existing food id.
          if (this.usedExistingFoodIds.includes(food.id)) continue;

          const matchesFood =
            prompt.foodCode !== undefined &&
            food.type === 'encoded-food' &&
            food.data.code === prompt.foodCode;

          const matchesCategory =
            prompt.categoryCode !== undefined &&
            food.type === 'encoded-food' &&
            food.data.categories.includes(prompt.categoryCode);

          if (matchesFood || matchesCategory) availableFoods.push(food.id);
        }

        return availableFoods;
      });
    },
  },

  methods: {
    isPromptValid,

    getFoodLabel(foodId: string): string {
      const food = this.meal?.foods.find((food) => food.id === foodId);
      return food ? getFoodDisplayText(food) : '';
    },

    getAlreadyEnteredLabel(index: number): string {
      const prompt = this.prompts[index];

      if (prompt.confirmed === 'existing' && prompt.existingFoodId) {
        return (
          this.$t(`prompts.${this.type}.alreadyEntered`) +
          ` (${this.getFoodLabel(prompt.existingFoodId)})`
        );
      }

      if (this.availableFoods[index].length == 1) {
        return (
          this.$t(`prompts.${this.type}.alreadyEntered`) +
          ` (${this.getFoodLabel(this.availableFoods[index][0])})`
        );
      }

      return this.$t(`prompts.${this.type}.alreadyEntered`).toString();
    },

    goToNextIfCan(index: number) {
      if (!isPromptValid(this.prompts[index])) return;

      this.activePrompt = getNextPrompt(this.prompts);
    },

    isFoodIdValid(id: string): boolean {
      return this.meal?.foods.some((food) => food.id === id) ?? false;
    },

    onConfirmStateChanged(index: number) {
      if (this.prompts[index].confirmed === 'existing') {
        // If there is only one compatible food available in this meal, select it automatically
        if (this.availableFoods[index].length === 1) {
          this.prompts.splice(index, 1, {
            confirmed: 'existing',
            existingFoodId: this.availableFoods[index][0],
            selectedFood: this.prompts[index].selectedFood,
          });
          this.updatePrompts();
        }
        // Do nothing otherwise, the food selection will be handled by the food chooser
      } else {
        const { foodCode, genericName } = this.associatedFoodPrompts[index];

        const selectedFood =
          this.prompts[index].confirmed === 'yes' && foodCode
            ? { code: foodCode, description: this.getLocaleContent(genericName) }
            : this.prompts[index].selectedFood;

        this.prompts.splice(index, 1, { confirmed: this.prompts[index].confirmed, selectedFood });
        this.updatePrompts();
      }

      // this.goToNextIfCan(index);
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

    existingFoodSelected(food: FoodState, promptIndex: number) {
      this.prompts.splice(promptIndex, 1, {
        confirmed: 'existing',
        existingFoodId: food.id,
      });
    },

    updatePrompts() {
      const { activePrompt, prompts } = this;

      this.$emit('update', { state: { activePrompt, prompts } });
    },
  },
});
</script>

<style lang="scss" scoped>
.food-selection {
  gap: 0.5rem 0.5rem;
}
</style>
