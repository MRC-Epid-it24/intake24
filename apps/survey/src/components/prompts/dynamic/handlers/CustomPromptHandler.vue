<template>
  <component :is="promptComponent" :prompt-props="promptProps" @answer="onAnswer"></component>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { BasePromptProps } from '@common/prompts';
import { CustomPromptAnswer } from '@common/types';
import customPrompts from '@/components/prompts/custom';

export default Vue.extend({
  name: 'CustomPromptHandler',
  components: {
    ...customPrompts,
  },

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
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

  computed: {
    ...mapGetters('survey', ['selection']),
  },

  methods: {
    onAnswer(answer: CustomPromptAnswer) {
      if (this.selection !== undefined && this.selection.element !== null) {
        // eslint-disable-next-line default-case
        switch (this.selection.element.type) {
          case 'food': {
            if (this.promptComponent === 'info-prompt')
              this.$store.commit('survey/setFoodFlag', {
                mealIndex: this.selection.element.mealIndex,
                foodIndex: this.selection.element.foodIndex,
                flag: `${this.promptId}-acknowledged`,
              });
            else
              this.$store.commit('survey/setFoodCustomPromptAnswer', {
                mealIndex: this.selection.element.mealIndex,
                foodIndex: this.selection.element.foodIndex,
                promptId: this.promptId,
                answer,
              });
            break;
          }
          case 'meal': {
            if (this.promptComponent === 'info-prompt')
              this.$store.commit('survey/setMealFlag', {
                mealIndex: this.selection.element.mealIndex,
                flag: `${this.promptId}-acknowledged`,
              });
            else
              this.$store.commit('survey/setMealCustomPromptAnswer', {
                mealIndex: this.selection.element.mealIndex,
                promptId: this.promptId,
                answer,
              });

            break;
          }
        }
      } else if (this.promptComponent === 'info-prompt')
        this.$store.commit('survey/setSurveyFlag', `${this.promptId}-acknowledged`);
      else
        this.$store.commit('survey/setCustomPromptAnswer', {
          promptId: this.promptId,
          answer,
        });

      this.$emit('complete');
    },
  },
});
</script>

<style scoped></style>
