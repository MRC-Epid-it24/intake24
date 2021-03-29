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
import genericPrompts from '@/components/prompts/generic';
import standardPrompts from '@/components/prompts/standard';
import surveyService from '@/services/survey.service';
import recall from '@/util/Recall';
import { Dictionary, Selection } from '@common/types';
import { SurveyEntryResponse } from '@common/types/http';

export default Vue.extend({
  name: 'RecallFlow',

  components: { ...genericPrompts, ...standardPrompts },

  props: {
    surveyId: {
      type: String,
    },
    mealId: {
      type: String,
    },
    questionId: {
      type: String,
    },
  },

  data() {
    return {
      recall,
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

  async created() {
    if (!this.recall.hasStarted()) {
      const { surveyId } = this;
      this.$router.push({ name: 'recall-entry', params: { surveyId } });
    }
  },

  beforeRouteUpdate(to, from, next) {
    const { surveyId, mealId, questionId } = to.params;
    const { section } = to.meta;

    const selection = this.recall.selectQuestionOrFindNext(section, mealId, questionId);
    if (!selection) {
      next();
      return;
    }

    const params: Dictionary<string> = {
      surveyId,
      questionId: selection.prompt.question.id,
    };
    if (selection.mealIdx !== undefined) params.mealId = selection.mealIdx.toString();

    next({ name: `recall-${selection.section}`, params });
  },

  methods: {
    async onAnswer(input: string | string[]) {
      console.log('onAnswer', input);
      const selection = this.recall.answerQuestion(input);

      const state = this.recall.getState();
      this.$store.dispatch('recall/setState', state);

      if (selection) {
        this.recall.setSelection(selection);

        const params: Dictionary<string> = {
          surveyId: this.surveyId,
          questionId: selection.prompt.question.id,
        };
        if (selection.mealIdx !== undefined) params.mealId = selection.mealIdx.toString();

        await this.$router.push({
          name: `recall-${selection.section}`,
          params,
        });
      }
    },

    async onSubmit(input: string | string[]) {
      console.log('onSubmit', input);
      try {
        const submission = this.recall.submit();
        await surveyService.submit(this.surveyId, submission);
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
