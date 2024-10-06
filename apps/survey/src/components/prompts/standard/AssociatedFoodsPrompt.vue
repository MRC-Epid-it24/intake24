<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="activePrompt" :tile="$vuetify.display.mobile" @update:model-value="updatePrompts">
      <v-expansion-panel v-for="(promptState, index) in promptStates" :key="index">
        <v-expansion-panel-title>
          {{ promptHeader(index) }}
          <template #actions>
            <expansion-panel-actions :valid="isPromptValid(promptState)" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-radio-group
            v-model="promptState.mainFoodConfirmed"
            :inline="!$vuetify.display.mobile"
            @update:model-value="onConfirmStateChanged(index)"
          >
            <v-radio
              false-icon="fa-regular fa-circle"
              :label="promptI18n.no"
              true-icon="$yes"
              :value="false"
            />
            <v-radio
              false-icon="fa-regular fa-circle"
              :label="promptI18n.yes"
              true-icon="$yes"
              :value="true"
            />
          </v-radio-group>

          <!-- Selected foods list -->
          <v-expand-transition>
            <div
              v-if="
                !associatedFoodPrompts[index].foodCode
                  && promptState.mainFoodConfirmed
                  && promptState.foods.length > 0
                  && !showFoodChooser(index)
              "
            >
              <v-card
                v-for="(foodItem, foodIndex) in promptState.foods"
                :key="foodIndex"
                class="mb-3"
                color="grey-lighten-4"
                flat
              >
                <v-card-text class="pa-2">
                  <v-row align="center" justify="space-between" no-gutters>
                    <v-col class="text-h6" cols="12" sm="auto">
                      <v-icon start>
                        $food
                      </v-icon>
                      {{ associatedFoodDescription(foodItem) }}
                    </v-col>
                    <v-col class="pt-2 pt-sm-0 d-flex flex-column ga-1" cols="12" sm="auto">
                      <v-btn
                        color="primary"
                        :title="promptI18n['select.different']"
                        variant="flat"
                        @click="replaceFood(index, foodIndex)"
                      >
                        <v-icon start>
                          $edit
                        </v-icon>
                        {{ promptI18n['select.different'] }}
                      </v-btn>
                      <confirm-dialog
                        v-if="allowMultiple && associatedFoodPrompts[index].multiple"
                        :label="promptI18n['select.remove']"
                        @confirm="removeFood(index, foodIndex)"
                      >
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            color="error"
                            :title="promptI18n['select.remove']"
                            variant="flat"
                          >
                            <v-icon start>
                              $delete
                            </v-icon>
                            {{ promptI18n['select.remove'] }}
                          </v-btn>
                        </template>
                        <i18n-t keypath="recall.menu.food.deleteConfirm" tag="span">
                          <template #item>
                            <span class="font-weight-medium">
                              {{ associatedFoodDescription(foodItem) }}
                            </span>
                          </template>
                        </i18n-t>
                      </confirm-dialog>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Additional food confirmation -->
          <v-expand-transition>
            <v-card v-show="showMoreFoodsQuestion(index)" flat>
              <v-card-title>{{ promptI18n.moreFoodsQuestion }}</v-card-title>
              <v-card-text>
                <v-radio-group
                  v-model="promptState.additionalFoodConfirmed"
                  :inline="!$vuetify.display.mobile"
                  @update:model-value="onConfirmStateChanged(index)"
                >
                  <v-radio
                    false-icon="fa-regular fa-circle"
                    :label="promptI18n.no"
                    true-icon="$yes"
                    :value="false"
                  />
                  <v-radio
                    false-icon="fa-regular fa-circle"
                    :label="promptI18n.yesAnother"
                    true-icon="$yes"
                    :value="true"
                  />
                </v-radio-group>
              </v-card-text>
            </v-card>
          </v-expand-transition>

          <!-- Existing food option: if there are any foods in the same meal that match
            the associated food criteria, allow to pick one of them -->
          <v-expand-transition>
            <v-card v-if="showFoodChooser(index) && availableFoods[index].length" flat>
              <v-card-title class="px-0 font-weight-regular">
                {{ promptI18n.existingFoodsTitle }}
              </v-card-title>
              <v-card-text class="px-0">
                <meal-food-chooser
                  v-if="meal"
                  :filter="(id) => availableFoods[index].includes(id)"
                  :meal-id="meal.id"
                  @selected="(id) => existingFoodSelected(id, index)"
                />
              </v-card-text>
            </v-card>
          </v-expand-transition>

          <!-- Database lookup -->
          <v-expand-transition>
            <v-card v-if="showFoodChooser(index)" flat>
              <v-card-title class="px-0 font-weight-regular">
                {{
                  availableFoods[index].length
                    ? promptI18n.databaseLookupWithExisting
                    : promptI18n.databaseLookupTitle
                }}
              </v-card-title>
              <v-card-text class="px-0">
                <food-browser
                  v-bind="{
                    localeId,
                    surveySlug,
                    prompt,
                    rootCategory: associatedFoodPrompts[index].categoryCode,
                    section,
                    includeHidden: true,
                  }"
                  @food-missing="foodMissing(index)"
                  @food-selected="(food) => foodSelected(food, index)"
                />
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';

import type {
  AssociatedFoodPrompt,
  AssociatedFoodPromptItem,
  PromptStates,
} from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/types';
import type { FoodHeader, UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import { getFoodDescription } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { ExpansionPanelActions, FoodBrowser } from '@intake24/survey/components/elements';
import MealFoodChooser from '@intake24/survey/components/prompts/partials/MealFoodChooser.vue';
import { usePromptUtils } from '@intake24/survey/composables';
import { ConfirmDialog } from '@intake24/ui';

import createBasePrompt from '../createBasePrompt';

function isPromptValid(prompt: AssociatedFoodPrompt): boolean {
  return prompt.mainFoodConfirmed === false
    || (prompt.mainFoodConfirmed === true
      && prompt.foods.length > 0
      && prompt.additionalFoodConfirmed === false);
}

function getNextPrompt(prompts: AssociatedFoodPrompt[]) {
  return prompts.findIndex(prompt => !isPromptValid(prompt));
}

export default defineComponent({
  name: 'AssociatedFoodsPrompt',

  components: { ConfirmDialog, ExpansionPanelActions, FoodBrowser, MealFoodChooser },

  mixins: [createBasePrompt<'associated-foods-prompt'>()],

  props: {
    food: {
      type: Object as PropType<EncodedFood>,
      required: true,
    },
    prompts: {
      type: Array as PropType<Array<UserAssociatedFoodPrompt>>,
      required: true,
    },
    localeId: {
      type: String,
      required: true,
    },
    surveySlug: {
      type: String,
    },
    modelValue: {
      type: Object as PropType<PromptStates['associated-foods-prompt']>,
      required: true,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { translate } = useI18n();
    const { action, translatePrompt, type } = usePromptUtils(props, ctx);

    const promptI18n = computed(() =>
      translatePrompt([
        'existingFoodHint',
        'yes',
        'yesAnother',
        'no',
        'moreFoodsQuestion',
        'databaseLookupTitle',
        'databaseLookupWithExisting',
        'existingFoodsTitle',
        'select.different',
        'select.remove',
      ]),
    );

    const activePrompt = ref(props.modelValue.activePrompt);
    const promptStates = ref(props.modelValue.promptStates);
    const allowMultiple = computed(() => props.prompt.multiple);

    const replaceFoodIndex = ref(
      props.prompts.map(() => undefined as number | undefined),
    );

    // React to changes to the meal's foods list and filter out references to foods (created
    // by the "use existing food" option) that have been removed from the meal.
    //
    // Case 1: an existing food id becomes invalid if the food is removed from the meal
    //         before the associated food prompt is completed (e.g., deleted via the side panel)

    // Case 2: a prompt state restored from local storage refers to an invalid food id
    //         (covered by the 'immediate' option)
    watch(
      () => props.meal?.foods,
      (newFoods) => {
        for (let i = 0; i < promptStates.value.length; ++i) {
          const prompt = promptStates.value[i];

          const update = {
            ...prompt,
            foods: prompt.foods.filter(food =>
              food.type === 'existing' ? newFoods?.some(f => f.id === food.existingFoodId) : true,
            ),
          };

          promptStates.value.splice(i, 1, update);
        }
      },
      { deep: true, immediate: true },
    );

    return {
      action,
      activePrompt,
      promptI18n,
      promptStates,
      replaceFoodIndex,
      allowMultiple,
      translate,
      type,
    };
  },

  computed: {
    associatedFoodPrompts(): UserAssociatedFoodPrompt[] {
      return this.prompts;
    },

    isValid(): boolean {
      return this.promptStates.every(isPromptValid);
    },

    usedExistingFoodIds(): string[] {
      const result = this.promptStates.flatMap(prompt =>
        prompt.foods
          .filter(food => food.type === 'existing' && food.existingFoodId !== undefined)
          .map(food => food.existingFoodId!),
      );

      return result;
    },

    availableFoods(): string[][] {
      const foodsInThisMeal = this.meal?.foods ?? [];

      return this.associatedFoodPrompts.map((prompt) => {
        const availableFoods: string[] = [];

        for (const food of foodsInThisMeal) {
          // Don't link food to itself
          if (food.id === this.food.id)
            continue;

          // Don't allow linking foods that have linked foods of their own
          if (food.linkedFoods.length)
            continue;

          // Don't allow two or more prompts to refer to the same existing food id.
          if (this.usedExistingFoodIds.includes(food.id))
            continue;

          const matchesFood
            = prompt.foodCode !== undefined
            && food.type === 'encoded-food'
            && food.data.code === prompt.foodCode;

          const matchesCategory
            = prompt.categoryCode !== undefined
            && food.type === 'encoded-food'
            && food.data.categories.includes(prompt.categoryCode);

          if (matchesFood || matchesCategory)
            availableFoods.push(food.id);
        }

        return availableFoods;
      });
    },
  },

  methods: {
    isPromptValid,

    promptHeader(index: number): string {
      const promptText = this.translate(this.associatedFoodPrompts[index].promptText);
      if (this.availableFoods[index].length > 0)
        return `${promptText} ${this.promptI18n.existingFoodHint}`;
      else
        return promptText;
    },

    showFoodChooser(promptIndex: number): boolean {
      const prompt = this.promptStates[promptIndex];

      return !!(
        this.replaceFoodIndex[promptIndex] !== undefined
        || (prompt.mainFoodConfirmed && !prompt.foods.length)
        || prompt.additionalFoodConfirmed
      );
    },

    showMoreFoodsQuestion(promptIndex: number): boolean {
      const associatedPrompt = this.associatedFoodPrompts[promptIndex];
      const state = this.promptStates[promptIndex];

      return !!(
        !associatedPrompt.foodCode
        && this.allowMultiple
        && this.associatedFoodPrompts[promptIndex].multiple
        && state.mainFoodConfirmed
        && state.foods.length > 0
        && this.replaceFoodIndex[promptIndex] === undefined
      );
    },

    associatedFoodDescription(food: AssociatedFoodPromptItem): string {
      if (food.type === 'selected' && food.selectedFood !== undefined)
        return food.selectedFood.name;
      if (food.type === 'existing' && food.existingFoodId !== undefined)
        return this.existingFoodDescription(food.existingFoodId);
      if (food.type === 'missing')
        return this.$t(`prompts.${this.type}.missing.placeholder`);
      return 'No food selected';
    },

    existingFoodDescription(foodId: string): string {
      const food = this.meal?.foods.find(food => food.id === foodId);
      return food ? getFoodDescription(food) : '';
    },

    replaceFood(promptIndex: number, foodIndex: number) {
      this.replaceFoodIndex.splice(promptIndex, 1, foodIndex);
    },

    removeFood(promptIndex: number, foodIndex: number) {
      const state = this.promptStates[promptIndex];

      const update = {
        ...state,
        foods: state.foods.slice(0, foodIndex).concat(state.foods.slice(foodIndex + 1)),
      };

      this.promptStates.splice(promptIndex, 1, update);

      this.updatePrompts();
    },

    foodSelected(food: FoodHeader, promptIndex: number): void {
      this.onFoodSelected({ type: 'selected', selectedFood: food }, promptIndex);
    },

    existingFoodSelected(foodId: string, promptIndex: number) {
      this.onFoodSelected({ type: 'existing', existingFoodId: foodId }, promptIndex);
    },

    foodMissing(promptIndex: number) {
      this.onFoodSelected({ type: 'missing' }, promptIndex);
    },

    onFoodSelected(selectedFood: AssociatedFoodPromptItem, promptIndex: number): void {
      const state = this.promptStates[promptIndex];
      const replaceIndex = this.replaceFoodIndex[promptIndex];

      const foods = state.foods.slice();

      if (replaceIndex !== undefined) {
        foods[replaceIndex] = selectedFood;
        this.replaceFoodIndex.splice(promptIndex, 1);
      }
      else {
        foods.push(selectedFood);
      }

      const update = {
        ...state,
        additionalFoodConfirmed:
          state.additionalFoodConfirmed === true ? undefined : state.additionalFoodConfirmed,
        foods,
      };

      this.promptStates.splice(promptIndex, 1, update);

      this.goToNextIfCan(promptIndex);
      this.updatePrompts();
    },

    onConfirmStateChanged(index: number) {
      const prompt = this.associatedFoodPrompts[index];
      const state = this.promptStates[index];
      if (state.mainFoodConfirmed && prompt.foodCode && !state.foods.length) {
        this.foodSelected(
          { code: prompt.foodCode, name: this.translate(prompt.genericName) },
          index,
        );
      }

      this.goToNextIfCan(index);
    },

    goToNextIfCan(index: number) {
      if (!isPromptValid(this.promptStates[index]))
        return;

      this.activePrompt = getNextPrompt(this.promptStates);
    },

    updatePrompts() {
      const { activePrompt, promptStates } = this;

      this.$emit('update:modelValue', { activePrompt, promptStates });
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
