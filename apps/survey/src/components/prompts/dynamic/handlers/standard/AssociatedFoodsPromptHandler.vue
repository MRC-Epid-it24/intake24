<template>
  <associated-foods-prompt
    v-bind="{
      promptProps,
      promptComponent,
      associatedFoods,
      food,
    }"
    @update="updatePrompts"
  >
  </associated-foods-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { AssociatedFoodsState, HasOnAnswer } from '@intake24/common/types';
import { mapActions, mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import AssociatedFoodsPrompt from '@intake24/survey/components/prompts/standard/AssociatedFoodsPrompt.vue';

export default (Vue as VueConstructor<Vue & HasOnAnswer>).extend({
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
    ...mapState(useSurvey, {
      food: (state) => state.selectedEncodedFood,
      associatedFoods: (state) => state.data.associatedFoods,
    }),
  },

  methods: {
    ...mapActions(useSurvey, ['updateAssociatedFoods']),

    updatePrompts(state: AssociatedFoodsState) {
      const id = this.food?.id;
      if (id === undefined) {
        console.warn('Expected an encoded food to be selected at this point');
        return;
      }

      this.updateAssociatedFoods(id, state);
    },
  },
});
</script>
