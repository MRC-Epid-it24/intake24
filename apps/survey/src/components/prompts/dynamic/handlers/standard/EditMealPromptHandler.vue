<template>
  <edit-meal-prompt
    ref="prompt"
    v-bind="{ initialState: state, mealName: selectedMeal.name, promptComponent, promptProps }"
    @continue="$emit('continue')"
    @remove-meal="removeMeal"
    @update="update"
  >
  </edit-meal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent, ref } from 'vue';

import type { BasePromptProps, StandardComponentType } from '@intake24/common/prompts';
import type { EditMealPromptState } from '@intake24/survey/components/prompts/standard/EditMealPrompt.vue';
import {
  useMealPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import EditMealPrompt from '@intake24/survey/components/prompts/standard/EditMealPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'EditMealPromptHandler',

  components: { EditMealPrompt },

  props: {
    promptComponent: {
      type: String as PropType<StandardComponentType>,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const prompt = ref<InstanceType<typeof EditMealPrompt>>();
    const { selectedMeal } = useMealPromptUtils();

    const getInitialState = (): EditMealPromptState => ({ foods: selectedMeal.value.foods });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.promptId,
      props.promptComponent,
      getInitialState,
      context
    );

    return {
      prompt,
      selectedMeal,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods', 'setMealFlag', 'deleteMeal']),

    removeMeal() {
      this.deleteMeal(this.selectedMeal.id);
      this.$emit('complete');
    },

    async commitAnswer() {
      const { foods } = this.state;
      const mealId = this.selectedMeal.id;

      this.setFoods({ mealId, foods });
      this.setMealFlag({ mealId, flag: 'free-entry-complete' });
      this.clearStoredState();
    },
  },
});
</script>
