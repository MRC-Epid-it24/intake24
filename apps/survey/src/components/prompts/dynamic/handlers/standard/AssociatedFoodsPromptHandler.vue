<template>
  <associated-foods-prompt
    :prompt-props="promptProps"
    :prompt-component="promptComponent"
    :associated-foods="associatedFoods"
    :food-name="foodName"
  >
  </associated-foods-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { HasOnAnswer } from '@intake24/common/types';
import { mapState } from 'pinia';
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
      associatedFoods: (store) => store.selectedEncodedFood?.data.associatedFoodPrompts,
      foodName: (store) => store.selectedEncodedFood?.data.localName,
    }),
  },
});
</script>
