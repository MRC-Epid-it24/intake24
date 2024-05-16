<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="activePrompt" :tile="isMobile" @change="updatePrompts">
      <v-expansion-panel v-for="(assocPrompt, index) in prompts" :key="index">
        <v-expansion-panel-header>
          {{ promptHeader(index) }}
          <template #actions>
            <expansion-panel-actions :valid="isPromptValid(assocPrompt)" />
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
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
            />
            <v-radio
              :label="promptI18n.yes"
              off-icon="fa-regular fa-circle"
              on-icon="$yes"
              :value="true"
            />
          </v-radio-group>

          <!-- Selected foods list -->
          <v-expand-transition>
            <div
              v-if="
                !associatedFoodPrompts[index].foodCode
                  && assocPrompt.mainFoodConfirmed
                  && assocPrompt.foods.length > 0
                  && !showFoodChooser(index)
              "
            >
              <v-card
                v-for="(foodItem, foodIndex) in assocPrompt.foods"
                :key="foodIndex"
                class="mb-3"
                color="grey lighten-4"
                flat
              >
                <div class="d-flex flex-column flex-sm-row justify-space-between px-3 py-2 ga-3">
                  <div class="align-self-start align-self-sm-center font-weight-medium">
                    <v-icon left>
                      $food
                    </v-icon>
                    {{ associatedFoodDescription(foodItem) }}
                  </div>
                  <div class="align-self-end align-self-sm-center">
                    <v-btn
                      color="primary lighten-1"
                      depressed
                      :title="promptI18n['select.different']"
                      @click="replaceFood(index, foodIndex)"
                    >
                      <v-icon left>
                        $edit
                      </v-icon>
                      {{ promptI18n['select.different'] }}
                    </v-btn>
                    <confirm-dialog
                      v-if="allowMultiple && associatedFoodPrompts[index].multiple"
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
                          <v-icon left>
                            $delete
                          </v-icon>
                          {{ promptI18n['select.remove'] }}
                        </v-btn>
                      </template>
                      <i18n path="recall.menu.food.deleteConfirm">
                        <template #item>
                          <span class="font-weight-medium">
                            {{ associatedFoodDescription(foodItem) }}
                          </span>
                        </template>
                      </i18n>
                    </confirm-dialog>
                  </div>
                </div>
              </v-card>
            </div>
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
                  />
                  <v-radio
                    :label="promptI18n.yesAnother"
                    off-icon="fa-regular fa-circle"
                    on-icon="$yes"
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
        </v-expansion-panel-content>
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
import { computed, defineComponent, ref, set, watch } from 'vue';

import type {
  AssociatedFoodPrompt,
  AssociatedFoodPromptItem,
  PromptStates,
} from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/types';
import type { FoodHeader, UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import { getFoodDescription } from '@intake24/common/types';
import { translate, useI18n } from '@intake24/i18n';
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
    localeId: {
      type: String,
      required: true,
    },
    surveySlug: {
      type: String,
    },
    value: {
      type: Object as PropType<PromptStates['associated-foods-prompt']>,
      required: true,
    },
  },

  emits: ['input'],

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

    const activePrompt = ref(props.value.activePrompt);
    const prompts = ref(props.value.prompts);
    const allowMultiple = computed(() => props.prompt.multiple);

    const replaceFoodIndex = ref(
      props.food.data.associatedFoodPrompts.map(() => undefined as number | undefined),
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
            foods: prompt.foods.filter(food =>
              food.type === 'existing' ? newFoods?.some(f => f.id === food.existingFoodId) : true,
            ),
          };

          set(prompts.value, i, update);
        }
      },
      { deep: true, immediate: true },
    );

    return {
      action,
      activePrompt,
      promptI18n,
      prompts,
      replaceFoodIndex,
      allowMultiple,
      translate,
      type,
    };
  },

  computed: {

    associatedFoodPrompts(): UserAssociatedFoodPrompt[] {
      return this.food.data.associatedFoodPrompts;
    },

    isValid(): boolean {
      return this.prompts.every(isPromptValid);
    },

    usedExistingFoodIds(): string[] {
      const result = this.prompts.flatMap(prompt =>
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
      const promptText = translate(this.associatedFoodPrompts[index].promptText);
      if (this.availableFoods[index].length > 0)
        return `${promptText} ${this.promptI18n.existingFoodHint}`;
      else
        return promptText;
    },

    showFoodChooser(promptIndex: number): boolean {
      const prompt = this.prompts[promptIndex];

      return !!(
        this.replaceFoodIndex[promptIndex] !== undefined
        || (prompt.mainFoodConfirmed && !prompt.foods.length)
        || prompt.additionalFoodConfirmed
      );
    },

    showMoreFoodsQuestion(promptIndex: number): boolean {
      const associatedPrompt = this.associatedFoodPrompts[promptIndex];
      const prompt = this.prompts[promptIndex];

      return !!(
        !associatedPrompt.foodCode
        && this.allowMultiple
        && this.associatedFoodPrompts[promptIndex].multiple
        && prompt.mainFoodConfirmed
        && prompt.foods.length > 0
        && this.replaceFoodIndex[promptIndex] === undefined
      );
    },

    associatedFoodDescription(food: AssociatedFoodPromptItem): string {
      if (food.type === 'selected' && food.selectedFood !== undefined)
        return food.selectedFood.name;
      if (food.type === 'existing' && food.existingFoodId !== undefined)
        return this.existingFoodDescription(food.existingFoodId);
      if (food.type === 'missing')
        return this.$t(`prompts.${this.type}.missing.placeholder`).toString();
      return 'No food selected';
    },

    existingFoodDescription(foodId: string): string {
      const food = this.meal?.foods.find(food => food.id === foodId);
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
      this.onFoodSelected({ type: 'selected', selectedFood: food }, promptIndex);
    },

    existingFoodSelected(foodId: string, promptIndex: number) {
      this.onFoodSelected({ type: 'existing', existingFoodId: foodId }, promptIndex);
    },

    foodMissing(promptIndex: number) {
      this.onFoodSelected({ type: 'missing' }, promptIndex);
    },

    onFoodSelected(selectedFood: AssociatedFoodPromptItem, promptIndex: number): void {
      const prompt = this.prompts[promptIndex];
      const replaceIndex = this.replaceFoodIndex[promptIndex];

      const foods = prompt.foods.slice();

      if (replaceIndex !== undefined) {
        foods[replaceIndex] = selectedFood;
        set(this.replaceFoodIndex, promptIndex, undefined);
      }
      else {
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
      const assocPrompt = this.associatedFoodPrompts[index];
      const prompt = this.prompts[index];
      if (prompt.mainFoodConfirmed && assocPrompt.foodCode && !prompt.foods.length) {
        this.foodSelected(
          { code: assocPrompt.foodCode, name: this.translate(assocPrompt.genericName) },
          index,
        );
      }

      this.goToNextIfCan(index);
    },

    goToNextIfCan(index: number) {
      if (!isPromptValid(this.prompts[index]))
        return;

      this.activePrompt = getNextPrompt(this.prompts);
    },

    updatePrompts() {
      const { activePrompt, prompts } = this;

      this.$emit('input', { activePrompt, prompts });
    },
  },
});
</script>

<style lang="scss" scoped></style>
