<template>
  <associated-foods-prompt
    v-bind="{
      promptProps,
      promptComponent,
      initialState,
      food: selectedEncodedFood,
    }"
    @update="updatePrompts"
  >
  </associated-foods-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { AssociatedFoodsState, RecallPromptHandler } from '@intake24/common/types';
import { mapActions, mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import AssociatedFoodsPrompt from '@intake24/survey/components/prompts/standard/AssociatedFoodsPrompt.vue';
import {
  createPromptHandlerMixin,
  PromptHandlerUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-utils';
import { FoodHeader } from '@intake24/common/types/http';

interface AssociatedFoodPromptState {
  confirmed: boolean | undefined;
  selectedFood: FoodHeader | undefined;
}

function initialPromptState(): AssociatedFoodPromptState {
  return {
    confirmed: undefined,
    selectedFood: undefined,
  };
}

export default (
  Vue as VueConstructor<Vue & RecallPromptHandler & PromptHandlerUtils<AssociatedFoodsState>>
).extend({
  name: 'AssociatedFoodsPromptHandler',

  mixins: [createPromptHandlerMixin<AssociatedFoodsState>('associated-foods-prompt')],

  components: { AssociatedFoodsPrompt },

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
  },

  created() {
    const selectedFood = this.selectedEncodedFood;

    if (selectedFood === undefined) {
      console.warn('Expected an encoded food to be selected at this point');
    } else {
      const defaultState = {
        activePrompt: 0,
        prompts: selectedFood.data.associatedFoodPrompts.map(() => initialPromptState()),
      };
      this.loadInitialState(selectedFood.id, this.promptId, defaultState);
    }
  },

  computed: {
    ...mapState(useSurvey, ['selectedEncodedFood']),
  },

  methods: {
    updatePrompts(state: AssociatedFoodsState) {
      const id = this.selectedEncodedFood?.id;

      if (id === undefined) {
        console.warn('Expected an encoded food to be selected at this point');
        return;
      }

      this.updateStoredState(id, this.promptId, state);
    },

    commitAnswer(): void {
      const id = this.selectedEncodedFood?.id;

      if (id === undefined) {
        console.warn('Expected an encoded food to be selected at this point');
        return;
      }

      this.clearStoredState(id, this.promptId);
      console.log('bleh');
    },
  },
});
</script>
