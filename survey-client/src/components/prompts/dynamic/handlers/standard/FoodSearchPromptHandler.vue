<template>
  <food-search-prompt
    :prompt-props="promptProps"
    :initial-search-term="selectedFoodDescription"
    @food-selected="onFoodSelected"
  ></food-search-prompt>
</template>

<script lang="ts">
import Vue from 'vue';
import FoodSearchPrompt from '@/components/prompts/standard/FoodSearchPrompt.vue';
import { mapGetters } from 'vuex';
import { FoodSearchPromptProps } from '@common/prompts';
import { FoodState } from '@common/types';

export default Vue.extend({
  name: 'FoodSearchPromptHandler',
  components: { FoodSearchPrompt },

  props: {
    promptProps: {
      type: Object as () => FoodSearchPromptProps,
    },
  },

  computed: {
    ...mapGetters('survey', ['selectedFood', 'selectedMealIndex']),

    selectedFoodDescription(): string {
      const { selectedFood } = this;

      if (selectedFood === undefined) throw new Error('This prompt requires a food to be selected');

      if (selectedFood.type !== 'free-text')
        throw new Error(
          'This prompt can only be displayed for foods that have not yet been encoded'
        );

      return selectedFood.description;
    },
  },

  methods: {
    onFoodSelected() {
      this.$emit('complete');
    },
  },
});
</script>

<style scoped></style>
