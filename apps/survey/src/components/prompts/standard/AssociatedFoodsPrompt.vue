<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="activePrompt" :tile="isMobile" @change="updatePrompts">
      <v-expansion-panel v-for="(assocPrompt, index) in prompts" :key="index">
        <v-expansion-panel-header>
          {{ translate(associatedFoodPrompts[index].promptText) }}
          <template #actions>
            <expansion-panel-actions :valid="isPromptValid(assocPrompt)"></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="pa-0">
            <v-radio-group
              v-model="assocPrompt.mainFoodConfirmed"
              :row="!isMobile"
              @change="onConfirmStateChanged(index)"
            >
              <v-radio
                :label="promptI18n.no"
                off-icon="fa-regular fa-circle"
                on-icon="$yes"
                :value="false"
              ></v-radio>
              <v-radio
                :label="promptI18n.yes"
                off-icon="fa-regular fa-circle"
                on-icon="$yes"
                :value="true"
              ></v-radio>
            </v-radio-group>
          </v-container>

          <!-- Selected foods list -->
          <v-expand-transition>
            <v-card
              v-if="
                assocPrompt.mainFoodConfirmed &&
                assocPrompt.foods.length > 0 &&
                !showFoodChooser(index)
              "
              class="pa-0"
              flat
            >
              <v-card-text class="d-flex flex-column flex-md-row pa-0 gap-2">
                <v-container>
                  <v-row
                    v-for="(food, foodIndex) in assocPrompt.foods"
                    :key="foodIndex"
                    align="baseline"
                    class="pa-0"
                  >
                    <v-alert class="flex-md-grow-1 mr-1" color="grey lighten-4" dense icon="$food">
                      {{ associatedFoodDescription(food) }}
                      <template #prepend>
                        <v-icon left>$food</v-icon>
                      </template>
                      <template #append>
                        <v-btn
                          color="primary lighten-1"
                          depressed
                          :title="promptI18n['select.different']"
                          @click="replaceFood(index, foodIndex)"
                        >
                          <v-icon left>$edit</v-icon>
                          {{ promptI18n['select.different'] }}
                        </v-btn>
                        <confirm-dialog
                          v-if="allowMultiple"
                          :label="promptI18n['select.remove']"
                          @confirm="removeFood(index, foodIndex)"
                        >
                          <template #activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              class="ml-2"
                              color="primary lighten-1"
                              depressed
                              :title="promptI18n['select.remove']"
                              v-on="on"
                            >
                              <v-icon left>$delete</v-icon>
                              {{ promptI18n['select.remove'] }}
                            </v-btn>
                          </template>
                          {{
                            $t(`recall.menu.confirmDelete`, {
                              item: associatedFoodDescription(food),
                            })
                          }}
                        </confirm-dialog>
                      </template>
                    </v-alert>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-expand-transition>

          <!-- Additional food confirmation -->
          <v-expand-transition>
            <v-card v-show="showMoreFoodsQuestion(index)" flat>
              <v-card-title>{{ promptI18n.moreFoodsQuestion }}</v-card-title>
              <v-card-text>
                <v-radio-group
                  v-model="assocPrompt.additionalFoodConfirmed"
                  :row="!isMobile"
                  @change="onConfirmStateChanged(index)"
                >
                  <v-radio
                    :label="promptI18n.no"
                    off-icon="fa-regular fa-circle"
                    on-icon="$yes"
                    :value="false"
                  ></v-radio>
                  <v-radio
                    :label="promptI18n.yesAnother"
                    off-icon="fa-regular fa-circle"
                    on-icon="$yes"
                    :value="true"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
          </v-expand-transition>

          <!-- Existing food option: if there are any foods in the same meal that match
            the associated food criteria, allow to pick one of them -->
          <v-expand-transition>
            <v-card v-if="showFoodChooser(index) && availableFoods[index].length" flat>
              <v-card-title>{{ promptI18n.existingFoodsTitle }}</v-card-title>
              <v-card-text>
                <meal-food-chooser
                  v-if="meal"
                  :filter="(id) => availableFoods[index].includes(id)"
                  :meal-id="meal.id"
                  @selected="(id) => existingFoodSelected(id, index)"
                ></meal-food-chooser>
              </v-card-text>
            </v-card>
          </v-expand-transition>

          <!-- Database lookup -->
          <v-expand-transition>
            <v-card v-if="showFoodChooser(index)" flat>
              <v-card-title>
                {{
                  availableFoods[index].length
                    ? promptI18n.databaseLookupWithExisting
                    : promptI18n.databaseLookupTitle
                }}
              </v-card-title>
              <v-card-text>
                <food-browser
                  v-bind="{
                    localeId,
                    prompt,
                    rootCategory: associatedFoodPrompts[index].categoryCode,
                  }"
                  @food-missing="foodMissing(index)"
                  @food-selected="(food) => foodSelected(food, index)"
                ></food-browser>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')"></next-mobile>
    </template>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref, set, watch } from 'vue';

import type {
  AssociatedFood,
  AssociatedFoodPromptItemState,
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

const isPromptValid = (prompt: AssociatedFoodPromptItemState): boolean =>
  prompt.mainFoodConfirmed === false ||
  (prompt.mainFoodConfirmed === true &&
    prompt.foods.length > 0 &&
    prompt.additionalFoodConfirmed === false);

const getNextPrompt = (prompts: AssociatedFoodPromptItemState[]) =>
  prompts.findIndex((prompt) => !isPromptValid(prompt));

export default defineComponent({
  name: 'AssociatedFoodsPrompt',

  components: { ConfirmDialog, ExpansionPanelActions, FoodBrowser, MealFoodChooser },

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
    const { translate } = useI18n();
    const { translatePrompt } = usePromptUtils(props);

    const promptI18n = computed(() =>
      translatePrompt([
        'yes',
        'yesAnother',
        'no',
        'moreFoodsQuestion',
        'databaseLookupTitle',
        'databaseLookupWithExisting',
        'existingFoodsTitle',
        'select.different',
        'select.remove',
      ])
    );

    const activePrompt = ref(props.initialState.activePrompt);
    const prompts = ref(props.initialState.prompts);
    const allowMultiple = computed(() => props.prompt.multiple);

    const replaceFoodIndex = ref(
      props.food.data.associatedFoodPrompts.map(() => undefined as number | undefined)
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
        for (let i = 0; i < prompts.value.length; ++i) {
          const prompt = prompts.value[i];

          const update = {
            ...prompt,
            foods: prompt.foods.filter((food) =>
              food.type === 'existing' ? newFoods?.some((f) => f.id === food.existingFoodId) : true
            ),
          };

          set(prompts.value, i, update);
        }
      },
      { deep: true, immediate: true }
    );

    return { activePrompt, promptI18n, prompts, replaceFoodIndex, allowMultiple, translate };
  },

  computed: {
    associatedFoodPrompts(): UserAssociatedFoodPrompt[] {
      return this.food.data.associatedFoodPrompts;
    },

    isValid(): boolean {
      return this.prompts.every(isPromptValid);
    },

    usedExistingFoodIds(): string[] {
      const result = this.prompts.flatMap((prompt) =>
        prompt.foods
          .filter((food) => food.type === 'existing' && food.existingFoodId !== undefined)
          .map((food) => food.existingFoodId!)
      );

      return result;
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

    showFoodChooser(promptIndex: number): boolean {
      const prompt = this.prompts[promptIndex];

      return !!(
        this.replaceFoodIndex[promptIndex] !== undefined ||
        (prompt.mainFoodConfirmed && prompt.foods.length == 0) ||
        prompt.additionalFoodConfirmed
      );
    },

    showMoreFoodsQuestion(promptIndex: number): boolean {
      const prompt = this.prompts[promptIndex];

      return !!(
        this.allowMultiple &&
        prompt.mainFoodConfirmed &&
        prompt.foods.length > 0 &&
        this.replaceFoodIndex[promptIndex] === undefined
      );
    },

    associatedFoodDescription(food: AssociatedFood): string {
      if (food.type === 'selected' && food.selectedFood !== undefined)
        return food.selectedFood.name;
      if (food.type === 'existing' && food.existingFoodId !== undefined)
        return this.existingFoodDescription(food.existingFoodId);
      if (food.type === 'missing')
        return this.$t(`prompts.${this.type}.missing.placeholder`).toString();
      return 'No food selected';
    },

    existingFoodDescription(foodId: string): string {
      const food = this.meal?.foods.find((food) => food.id === foodId);
      return food ? getFoodDescription(food) : '';
    },

    replaceFood(promptIndex: number, foodIndex: number) {
      set(this.replaceFoodIndex, promptIndex, foodIndex);
    },

    removeFood(promptIndex: number, foodIndex: number) {
      const prompt = this.prompts[promptIndex];

      const update = {
        ...prompt,
        foods: prompt.foods.slice(0, foodIndex).concat(prompt.foods.slice(foodIndex + 1)),
      };

      this.prompts.splice(promptIndex, 1, update);

      this.updatePrompts();
    },

    foodSelected(food: FoodHeader, promptIndex: number): void {
      this.onFoodSelected(
        {
          type: 'selected',
          selectedFood: food,
        },
        promptIndex
      );
    },

    existingFoodSelected(foodId: string, promptIndex: number) {
      this.onFoodSelected(
        {
          type: 'existing',
          existingFoodId: foodId,
        },
        promptIndex
      );
    },

    foodMissing(promptIndex: number) {
      this.onFoodSelected(
        {
          type: 'missing',
        },
        promptIndex
      );
    },

    onFoodSelected(selectedFood: AssociatedFood, promptIndex: number): void {
      const prompt = this.prompts[promptIndex];
      const replaceIndex = this.replaceFoodIndex[promptIndex];

      const foods = prompt.foods.slice();

      if (replaceIndex !== undefined) {
        foods[replaceIndex] = selectedFood;
        set(this.replaceFoodIndex, promptIndex, undefined);
      } else {
        foods.push(selectedFood);
      }

      const update = {
        ...prompt,
        additionalFoodConfirmed:
          prompt.additionalFoodConfirmed === true ? undefined : prompt.additionalFoodConfirmed,
        foods,
      };

      this.prompts.splice(promptIndex, 1, update);

      this.goToNextIfCan(promptIndex);
      this.updatePrompts();
    },

    onConfirmStateChanged(index: number) {
      this.goToNextIfCan(index);
    },

    goToNextIfCan(index: number) {
      if (!isPromptValid(this.prompts[index])) return;

      this.activePrompt = getNextPrompt(this.prompts);
    },

    updatePrompts() {
      const { activePrompt, prompts } = this;

      this.$emit('update', { state: { activePrompt, prompts } });
    },
  },
});
</script>

<style lang="scss" scoped></style>
