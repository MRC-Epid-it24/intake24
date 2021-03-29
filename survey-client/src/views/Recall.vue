<template>
  <v-row>
    <v-col cols="12" md="10">
      <v-toolbar class="mb-4">
        <v-btn @click="$router.back()"> back </v-btn>
      </v-toolbar>
      <transition name="component-fade" mode="out-in">
        <component
          v-if="currentSelection"
          :is="currentSelection.prompt.question.component"
          :key="currentSelection.prompt.question.id"
          :props="currentSelection.prompt.question.props"
          :value="currentSelection.prompt.answer"
          @answer="onAnswer"
          @submit="onSubmit"
        ></component>
      </transition>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import prompts from '@/components/prompts/';
import Recall from '@/util/Recall';
import { Selection } from '@common/types';
import { SurveyEntryResponse } from '@common/types/http';
import surveyService from '@/services/survey.service';

export default Vue.extend({
  name: 'Recall',

  components: { ...prompts },

  data() {
    return {
      recall: new Recall(),
    };
  },

  computed: {
    survey(): SurveyEntryResponse | null {
      return this.$store.state.recall.survey;
    },
    currentSelection(): Selection | null {
      return this.recall.currentSelection;
    },
  },

  async mounted() {
    if (this.survey?.scheme) {
      this.recall.init(this.survey.scheme);
      const selection = this.recall.getSelection();
      if (!selection) return;

      const {
        params: { questionId },
        meta: { section },
      } = this.$route;

      if (section !== selection.section || questionId !== selection.prompt.question.id) {
        this.$router.push({
          name: `recall-${selection.section}`,
          params: { surveyId: this.survey.id, questionId: selection.prompt.question.id },
        });
      }
    }
  },

  beforeRouteUpdate(to, from, next) {
    const { surveyId, questionId } = to.params;

    const selection = this.recall.selectQuestionOrFindNext('preMeals', questionId);
    if (!selection) {
      next();
      return;
    }

    next({
      name: `recall-${selection.section}`,
      params: { surveyId, questionId: selection.prompt.question.id },
    });
  },

  methods: {
    async onAnswer(input: string | string[]) {
      console.log('onAnswer', input);
      const selection = this.recall.answerQuestion(input);

      const state = this.recall.getState();
      this.$store.dispatch('recall/setState', state);

      if (selection) {
        this.recall.setSelection(selection);
        this.$router.push({
          name: `recall-${selection.section}`,
          params: { surveyId: 'demo', questionId: selection.prompt.question.id },
        });
      }
    },

    async onSubmit(input: string | string[]) {
      console.log('onSubmit', input);
      try {
        const submission = this.recall.submit();
        await surveyService.submit(this.$route.params.surveyId, submission);
        await this.$store.dispatch('recall/clearState');
      } catch (err) {
        // process error
      }
    },
  },
});
</script>

<style lang="scss">
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
