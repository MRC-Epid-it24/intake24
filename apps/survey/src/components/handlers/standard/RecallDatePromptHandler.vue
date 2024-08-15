<template>
  <recall-date-prompt
    v-model="state"
    v-bind="{ prompt, section }"
    @action="action"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { RecallDatePrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'RecallDatePromptHandler',

  components: { RecallDatePrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['recall-date-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const survey = useSurvey();

    const getInitialState = computed(
      () => survey.data.recallDate,
      // typeof props.prompt.current === 'number' ? addDays(new Date(), props.prompt.current).toISOString().substring(0, 10) : null,
    );

    const { state } = usePromptHandlerNoStore(ctx, getInitialState);

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next')
        commitAnswer();

      ctx.emit('action', type, ...args);
    };

    const commitAnswer = () => {
      survey.setRecallDate(state.value);
    };

    return { state, action };
  },
});
</script>

<style scoped></style>
