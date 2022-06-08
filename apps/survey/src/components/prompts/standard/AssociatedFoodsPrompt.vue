<template>
  <prompt-layout :text="text" :description="description">
    <v-card-actions :class="isNotDesktop && 'justify-center'">
      <v-row>
        <v-col>
          <v-expansion-panels v-model="activePrompt" @change="updatePrompts">
            <v-expansion-panel v-for="(prompt, index) in prompts" :key="index">
              <v-expansion-panel-header color="#f5f5f5" disable-icon-rotate class="text-body-1">
                {{ associatedFoodPrompts[index].promptText }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="prompt.confirmed !== undefined"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pl-0">
                <v-container class="pl-0">
                  <v-btn-toggle v-model="prompt.confirmed" @change="updatePrompts">
                    <v-btn :value="false">{{ $t('prompts.associatedFoods.no') }}</v-btn>
                    <v-btn :value="true">{{ $t('prompts.associatedFoods.yes') }}</v-btn>
                  </v-btn-toggle>
                </v-container>
                <v-expand-transition>
                  <v-card flat v-show="prompt.confirmed === true">
                    <v-card-title class="pl-0 pa-2" style="border-bottom: 1px solid lightgray"
                      >Please select an item from this category:</v-card-title
                    >
                    <v-card-text class="pl-0">
                      <FoodBrowser
                        :root-category="associatedFoodPrompts[index].categoryCode"
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
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import ValidInvalidIcon from '@intake24/survey/components/elements/ValidInvalidIcon.vue';
import { AssociatedFoodsState, EncodedFood } from '@intake24/common/types';
import { UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import FoodBrowser from '@intake24/survey/components/elements/FoodBrowser.vue';
import BasePrompt, { Prompt } from '../BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'AssociatedFoodsPrompt',

  components: { FoodBrowser, ValidInvalidIcon },

  mixins: [BasePrompt],

  props: {
    promptComponent: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    associatedFoods: {
      type: Object as PropType<{ [key: number]: AssociatedFoodsState }>,
      required: true,
    },
    food: {
      type: Object as PropType<EncodedFood>,
      required: true,
    },
  },

  data() {
    const assocFoodEntry = this.associatedFoods[this.food.id] ?? {};
    const {
      activePrompt = 0,
      prompts = this.food.data.associatedFoodPrompts.map(() => ({ confirmed: undefined })),
    } = assocFoodEntry;

    return {
      activePrompt,
      prompts,
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
    updatePrompts() {
      const { activePrompt, prompts } = this;
      this.$emit('update', { activePrompt, prompts });
    },

    submit() {
      this.$emit('answer', null);
    },
  },
});
</script>

<style lang="scss" scoped></style>
