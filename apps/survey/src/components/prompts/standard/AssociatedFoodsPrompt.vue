<template>
  <prompt-layout v-bind="{ description, text }">
    <v-card-actions :class="isNotDesktop && 'justify-center'">
      <v-row>
        <v-col>
          <v-expansion-panels v-model="activePrompt" @change="updatePrompts">
            <v-expansion-panel v-for="(prompt, index) in prompts" :key="index">
              <v-expansion-panel-header class="text-body-1" color="#f5f5f5" disable-icon-rotate>
                {{ associatedFoodPrompts[index].promptText }}
                <template #actions>
                  <valid-invalid-icon
                    :valid="
                      prompt.confirmed === false ||
                      (prompt.confirmed === true && prompt.selectedFood !== undefined)
                    "
                  ></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pl-0">
                <v-container class="pl-0">
                  <v-btn-toggle v-model="prompt.confirmed" @change="updatePrompts">
                    <v-btn :value="false">{{ $t('prompts.associatedFoods.no') }}</v-btn>
                    <v-btn :value="true">{{ $t('prompts.associatedFoods.yes') }}</v-btn>
                  </v-btn-toggle>
                </v-container>
                <v-card v-if="prompt.confirmed === true && prompt.selectedFood !== undefined" flat>
                  <v-card-title
                    ><span class="fa fa-check mr-2"></span
                    >{{ prompt.selectedFood.description }}</v-card-title
                  >
                  <v-card-actions>
                    <v-btn @click="onSelectDifferentFood(prompt)">Select a different food </v-btn>
                  </v-card-actions>
                </v-card>
                <v-expand-transition>
                  <v-card
                    v-show="prompt.confirmed === true && prompt.selectedFood === undefined"
                    flat
                  >
                    <v-card-title class="pl-0 pa-2" style="border-bottom: 1px solid lightgray"
                      >Please select an item from this category:</v-card-title
                    >
                    <v-card-text class="pl-0">
                      <FoodBrowser
                        :locale-id="localeId"
                        :root-category="associatedFoodPrompts[index].categoryCode"
                        @food-selected="(food) => onFoodSelected(food, index)"
                      ></FoodBrowser>
                    </v-card-text>
                  </v-card>
                </v-expand-transition>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-card-actions>
    <v-row class="mt-2">
      <v-col>
        <continue class="px-2" :disabled="!continueEnabled" @click="onContinue"></continue>
      </v-col>
    </v-row>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import Vue, { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type {
  AssociatedFoodPromptState,
  AssociatedFoodsState,
  EncodedFood,
} from '@intake24/common/types';
import type { FoodHeader, UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import FoodBrowser from '@intake24/survey/components/elements/FoodBrowser.vue';
import ValidInvalidIcon from '@intake24/survey/components/elements/ValidInvalidIcon.vue';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'AssociatedFoodsPrompt',

  components: { FoodBrowser, ValidInvalidIcon },

  mixins: [BasePrompt],

  props: {
    localeId: {
      type: String,
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
    initialState: {
      type: Object as PropType<AssociatedFoodsState>,
      required: true,
    },
    food: {
      type: Object as PropType<EncodedFood>,
      required: true,
    },
    continueEnabled: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      activePrompt: this.initialState.activePrompt,
      prompts: this.initialState.prompts,
    };
  },

  computed: {
    associatedFoodPrompts(): UserAssociatedFoodPrompt[] {
      return this.food.data.associatedFoodPrompts;
    },

    foodName(): string {
      return this.food.data.localName;
    },

    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      return text
        ? text.replace('{food}', this.foodName ?? '')
        : this.$t('prompts.associatedFoods.text', {
            food: this.foodName?.toLocaleLowerCase(),
          }).toString();
    },
    description(): string {
      const description = this.promptProps.description[this.$i18n.locale];
      return description
        ? description.replace('{food}', this.foodName ?? '')
        : this.$t('prompts.associatedFoods.description', { meal: this.foodName }).toString();
    },
  },

  methods: {
    onSelectDifferentFood(prompt: AssociatedFoodPromptState) {
      prompt.selectedFood = undefined;
      this.updatePrompts();
    },

    onFoodSelected(food: FoodHeader, promptIndex: number): void {
      Vue.set(this.prompts, promptIndex, {
        confirmed: true,
        selectedFood: food,
      });
      this.updatePrompts();
    },

    updatePrompts() {
      const { activePrompt, prompts } = this;
      this.$emit('update', { activePrompt, prompts });
    },

    onContinue() {
      this.$emit('continue');
    },
  },
});
</script>

<style lang="scss" scoped></style>
