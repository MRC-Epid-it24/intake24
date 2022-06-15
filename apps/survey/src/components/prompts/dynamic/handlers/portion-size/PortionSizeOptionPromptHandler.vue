<template>
  <portion-size-option-prompt
    v-bind="{ foodName, promptProps, availableMethods }"
    :prompt-component="promptComponent"
    v-on="$listeners"
    @update="onUpdate"
  >
  </portion-size-option-prompt>
</template>

<script lang="ts">
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { PropType } from '@vue/composition-api';
import type { BasePromptProps } from '@intake24/common/prompts';
import type { RecallPromptHandler } from '@intake24/common/types';
import type { UserPortionSizeMethod } from '@intake24/common/types/http';
import PortionSizeOptionPrompt from '@intake24/survey/components/prompts/portion/PortionSizeOptionPrompt.vue';
import { mapActions } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import foodPromptUtils from '../mixins/food-prompt-utils';

type Mixins = InstanceType<typeof foodPromptUtils>;

export default (Vue as VueConstructor<Vue & Mixins & RecallPromptHandler>).extend({
  name: 'PortionSizeOptionPromptHandler',

  components: { PortionSizeOptionPrompt },

  mixins: [foodPromptUtils],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
  },

  computed: {
    availableMethods(): UserPortionSizeMethod[] {
      return this.encodedSelectedFood.data.portionSizeMethods;
    },
  },

  data() {
    return {
      option: 0,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    onUpdate(option: number) {
      this.option = option;
    },

    commitAnswer() {
      const { selectedMealIndex: mealIndex, selectedFoodIndex: foodIndex } = this;
      if (mealIndex === undefined || foodIndex === undefined) {
        console.warn('No selected meal/food, meal/food index undefined');
        return;
      }

      this.updateFood({
        mealIndex,
        foodIndex,
        food: { portionSizeMethodIndex: this.option },
      });
    },
  },
});
</script>
