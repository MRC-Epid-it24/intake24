<template>
  <same-as-before-prompt v-bind="{ food: encodedFood(), prompt }" @action="action">
  </same-as-before-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent, onMounted } from 'vue';

import type { GenericActionType, Prompts } from '@intake24/common/prompts';
import { SameAsBeforePrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils } from '../mixins';

export default defineComponent({
  name: 'SameAsBeforePromptHandler',

  components: { SameAsBeforePrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['same-as-before-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const { encodedFood } = useFoodPromptUtils();
    const survey = useSurvey();

    const complete = () => {
      survey.setFoodFlag({ foodId: encodedFood().id, flag: 'same-as-before-complete' });
      emit('action', 'next');
    };

    const notSame = () => {
      complete();
    };

    const same = () => {
      complete();
    };

    onMounted(() => {
      //
    });

    return { encodedFood, notSame, same };
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods']),

    action(type: 'notSame' | 'same' | GenericActionType, id?: number) {
      if (['notSame', 'same'].includes(type)) {
        this[type as 'notSame' | 'same']();
        return;
      }

      this.$emit('action', type, id);
    },
  },
});
</script>
