<template>
  <base-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-expansion-panels
      v-model="activePrompt"
      :flat="isMobile"
      :tile="isMobile"
      @change="updatePrompts"
    >
      <v-expansion-panel v-for="(prompt, index) in prompts" :key="index">
        <v-expansion-panel-header>
          {{ associatedFoodPrompts[index].promptText }}
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
            <v-card-title>
              <v-icon left>$ok</v-icon>
              {{ prompt.selectedFood.description }}
            </v-card-title>
            <v-card-actions>
              <v-btn @click="onSelectDifferentFood(prompt)">
                {{ $t(`prompts.${type}.select.different`) }}
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-expand-transition>
            <v-card v-show="prompt.confirmed === 'yes' && prompt.selectedFood === undefined" flat>
              <v-card-title class="px-0 pa-2" style="border-bottom: 1px solid lightgray">
                {{ $t(`prompts.${type}.select.item`) }}
              </v-card-title>
              <v-card-text class="px-0">
                <food-browser
                  :locale-id="localeId"
                  :root-category="associatedFoodPrompts[index].categoryCode"
                  @food-selected="(food) => foodSelected(food, index)"
                ></food-browser>
              </v-card-text>
              <v-card-text>
                <v-btn
                  :block="isMobile"
                  color="secondary"
                  :disabled="missing"
                  large
                  outlined
                  :title="$t(`prompts.${type}.missing.label`)"
                  @click.stop="missing = true"
                >
                  {{ $t(`prompts.${type}.missing.label`) }}
                </v-btn>
              </v-card-text>
              <missing-food-panel
                v-model="missing"
                :type="type"
                @cancel="missing = false"
                @confirm="foodMissing(index)"
              ></missing-food-panel>
            </v-card>
          </v-expand-transition>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import Vue, { defineComponent } from 'vue';

import type { AssociatedFoodPromptItemState, PromptStates } from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/types';
import type { FoodHeader, UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import { ExpansionPanelActions, FoodBrowser } from '@intake24/survey/components/elements';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndexRequired } from '@intake24/survey/util';

import createBasePrompt from '../createBasePrompt';
import { MissingFoodPanel } from './partials';

const isPromptValid = (prompt: AssociatedFoodPromptItemState): boolean =>
  (prompt.confirmed && ['no', 'existing', 'missing'].includes(prompt.confirmed)) ||
  (prompt.confirmed === 'yes' && prompt.selectedFood !== undefined);

const getNextPrompt = (prompts: AssociatedFoodPromptItemState[]) =>
  prompts.findIndex((prompt) => !isPromptValid(prompt));

export default defineComponent({
  name: 'AssociatedFoodsPrompt',

  components: { ExpansionPanelActions, FoodBrowser, MissingFoodPanel },

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

  data() {
    return {
      activePrompt: this.initialState.activePrompt,
      missing: false,
      prompts: this.initialState.prompts,
      usedExistingFoodIds: [] as string[],
    };
  },

  computed: {
    ...mapState(useSurvey, ['meals']),

    foodsAlreadyEntered(): (string | undefined)[] {
      const foodIndex = getFoodIndexRequired(this.meals, this.food.id);
      const foodsInThisMeal = this.meals[foodIndex.mealIndex].foods;

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
          Vue.set(this.prompts, index, {
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

        const selectedFood =
          this.prompts[index].confirmed === 'yes' && this.associatedFoodPrompts[index].foodCode
            ? {
                code: this.associatedFoodPrompts[index].foodCode,
                description: this.associatedFoodPrompts[index].genericName,
              }
            : this.prompts[index].selectedFood;

        Vue.set(this.prompts, index, { confirmed: this.prompts[index].confirmed, selectedFood });
      }

      this.goToNextIfCan(index);
      this.updatePrompts();
    },

    onSelectDifferentFood(prompt: AssociatedFoodPromptItemState) {
      prompt.selectedFood = undefined;

      this.updatePrompts();
    },

    foodSelected(food: FoodHeader, promptIndex: number): void {
      Vue.set(this.prompts, promptIndex, {
        confirmed: 'yes',
        selectedFood: food,
      });

      this.goToNextIfCan(promptIndex);
      this.updatePrompts();
    },

    foodMissing(promptIndex: number) {
      Vue.set(this.prompts, promptIndex, { confirmed: 'missing' });

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
