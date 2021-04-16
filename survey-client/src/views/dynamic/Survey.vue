<template>
  <v-row justify="center" class="pa-0">
    <v-col cols="12" lg="9" class="content">
      <transition name="component-fade" mode="out-in">
        <component
          v-if="currentPrompt"
          :is="currentPrompt.component"
          :promptProps="currentPrompt.props"
          @answer="onAnswer"
        ></component>
      </transition>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { SchemeEntryResponse } from '@common/types/http';
import customPrompts from '@/components/prompts/custom';
import standardPrompts from '@/components/prompts/standard';
import { conditionOps, PromptAnswer, PromptQuestion } from '@common/prompts';
import { SurveyState as CurrentSurveyState } from '@common/types';
import { SurveyState } from '@/types/vuex';

function checkStandardConditions(state: SurveyState, prompt: PromptQuestion): boolean {
  if (state.data == null) {
    console.error(`Survey data should not be null at this point`);
    return false;
  }

  switch (prompt.component) {
    case 'info-prompt':
      return !state.data.flags.includes(`${prompt.id}-acknowledged`);
    default:
      return state.data.customPromptAnswers[prompt.id] === undefined;
  }
}

function checkCustomConditions(state: SurveyState, prompt: PromptQuestion) {
  return prompt.props.conditions.every((condition) => {
    switch (condition.type) {
      case 'promptAnswer':
        if (state.data == null) {
          console.error('Survey data should not be null at this point');
          return false;
        }
        return conditionOps[condition.op]([condition.value, state.data.customPromptAnswers[prompt.id]]);
      case 'recallNumber':
        if (state.user == null) {
          console.error('User information should not be null at this point');
          return false;
        }
        return conditionOps[condition.op]([condition.value, state.user.recallNumber]);
      default:
        console.error(`Unexpected condition type: ${condition.type}`);
        return false;
    }
  });
}

export default Vue.extend({
  name: 'Survey',

  components: {
    ...customPrompts,
    ...standardPrompts,
  },

  data: () => {
    return {
      currentPrompt: null as PromptQuestion | null,
    };
  },

  computed: {
    surveyScheme(): SchemeEntryResponse | null {
      return this.$store.state.survey.parameters?.scheme;
    },
  },

  async mounted() {
    if (this.surveyScheme == null) {
      console.error('Survey scheme must be known at this point');
      return;
    }

    if (!this.$store.state.survey.data) {
      console.debug('Current survey data is null, starting new survey');

      const initialState: CurrentSurveyState = {
        schemeId: this.surveyScheme.id,
        startTime: new Date(),
        endTime: null,
        flags: [],
        customPromptAnswers: {},
        meals: [],
      };

      await this.$store.dispatch('survey/setState', initialState);
    }

    await this.nextPrompt();
  },

  methods: {
    async nextPrompt() {
      if (!this.surveyScheme || !this.$store.state.survey) {
        console.error('Survey parameters or survey state is null');
        return;
      }

      const nextPrompt = this.surveyScheme.questions.preMeals.find((question) => {
        return (
          checkStandardConditions(this.$store.state.survey, question) &&
          checkCustomConditions(this.$store.state.survey, question)
        );
      });

      if (nextPrompt === undefined) {
        await this.$router.push({ name: 'recall-entry', params: this.$route.params });
      } else {
        this.currentPrompt = nextPrompt;
      }
    },

    onAnswer(answer: PromptAnswer) {
      if (this.currentPrompt) {
        switch (this.currentPrompt.component) {
          case 'info-prompt':
            this.$store.commit('survey/setSurveyFlag', `${this.currentPrompt.id}-acknowledged`);
            break;
          default:
            this.$store.commit('survey/addSurveyAnswer', {
              promptId: this.currentPrompt.id,
              answer,
            });
            break;
        }
      }

      this.nextPrompt();
    },
  },
});
</script>
