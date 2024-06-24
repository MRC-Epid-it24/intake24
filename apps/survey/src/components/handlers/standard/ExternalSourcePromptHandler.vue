<template>
  <external-source-prompt
    v-bind="{ food: food(), meal, prompt, section }"
    v-model="state"
    @action="action"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { getFoodDescription } from '@intake24/common/types';
import { ExternalSourcePrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'ExternalSourcePromptHandler',

  components: { ExternalSourcePrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['external-source-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const { food } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();

    const getInitialState = computed<PromptStates['external-source-prompt']>(() => ({
      data: undefined,
      searchTerm: getFoodDescription(food()),
      type: undefined,
    }));

    const { state } = usePromptHandlerNoStore(ctx, getInitialState);

    const commitAnswer = () => {
      const survey = useSurvey();
      const foodEntry = food();

      survey.updateFood({ foodId: foodEntry.id, update: {
        external: { ...foodEntry.external, [props.prompt.source.type]: state.value },
      } });
    };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (!['next', 'missing'].includes(type)) {
        ctx.emit('action', type, ...args);
        return;
      }

      state.value.type = type === 'next' ? 'selected' : 'missing';

      commitAnswer();
      ctx.emit('action', 'next');
    };

    return { action, food, meal, state };
  },
});
</script>
