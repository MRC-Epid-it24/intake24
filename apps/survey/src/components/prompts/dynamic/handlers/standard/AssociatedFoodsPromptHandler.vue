<template>
  <associated-foods-prompt
    v-bind="{
      promptProps,
      promptComponent,
      associatedFoodsState,
      food: selectedEncodedFood,
    }"
    @update="updatePrompts"
  >
  </associated-foods-prompt>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { BasePromptProps } from '@intake24/common/prompts';
import type { AssociatedFoodsState } from '@intake24/common/types';
import { mapActions, mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import AssociatedFoodsPrompt from '@intake24/survey/components/prompts/standard/AssociatedFoodsPrompt.vue';
import { useAssociatedFoodsState } from '@intake24/survey/stores/associated-foods';

export default defineComponent({
  name: 'AssociatedFoodsPromptHandler',

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
  },

  computed: {
    ...mapState(useSurvey, ['selectedEncodedFood']),
    ...mapState(useAssociatedFoodsState, ['associatedFoodsState']),
  },

  methods: {
    ...mapActions(useAssociatedFoodsState, ['updateAssociatedFoods']),

    updatePrompts(state: AssociatedFoodsState) {
      const id = this.selectedEncodedFood?.id;

      if (id === undefined) {
        console.warn('Expected an encoded food to be selected at this point');
        return;
      }

      this.updateAssociatedFoods(id, state);
    },

    commitAnswer(): void {
      console.log('bleh');
    },
  },
});
</script>
