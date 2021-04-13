<template>
  <v-row justify="center" class="pa-0">
    <v-col cols="12" class="mealbar stickytop">
      <meal-list-mobile-top :foods="foods" :meals="recall.meals" v-if="isNotDesktop">
      </meal-list-mobile-top>
    </v-col>
    <v-col v-if="!isNotDesktop" cols="3" lg="3">
      <meal-list :surveyName="survey.name" :meals="recall.meals"></meal-list>
    </v-col>
    <v-col cols="12" lg="9" class="content">
      <v-toolbar class="mb-4">
        <v-breadcrumbs v-if="!isNotDesktop" :items="brdMeal" divider="/"></v-breadcrumbs>
        <v-spacer v-if="!isNotDesktop"></v-spacer>
        <v-btn @click="$router.back()"> back </v-btn>
      </v-toolbar>
      <transition name="component-fade" mode="out-in">
        <component
          v-if="currentSelection"
          :is="currentSelection.prompt.question.component"
          :key="currentSelection.prompt.question.id"
          :promptProps="currentSelection.prompt.question.props"
          :value="currentSelection.prompt.answer"
          @answer="answer"
          @submit="submit"
        ></component>
      </transition>
    </v-col>
    <v-col cols="12" class="foodbar stickybottom">
      <meal-list-mobile-bottom v-if="isNotDesktop" :loading="false" :foods="foods">
      </meal-list-mobile-bottom>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import customPrompts from '@/components/prompts/custom';
import standardPrompts from '@/components/prompts/standard';
import MealList from '@/components/recall/MealListDesktop.vue';
import MealListMobileTop from '@/components/recall/mobile_interface2/MealListMobileTop.vue';
import MealListMobileBottom from '@/components/recall/mobile_interface2/MealListMobileBottom.vue';
import surveyService from '@/services/survey.service';
import recall from '@/util/Recall';
import { Dictionary, Selection } from '@common/types';
import { SurveyEntryResponse } from '@common/types/http';

export default Vue.extend({
  name: 'RecallFlow',

  components: {
    MealListMobileBottom,
    MealListMobileTop,
    MealList,
    ...customPrompts,
    ...standardPrompts,
  },

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
    // Placeholder for foods
    const foods: any = [];
    return {
      recall,
      foods,
      brdMeal: [
        {
          text: 'Choose Meal',
          disabled: true,
        },
        {
          text: 'Choose Food',
          disabled: true,
        },
      ],
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
    async answer(input: string | string[]) {
      console.log('answer', input);
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

    async submit(input: string | string[]) {
      console.log('submit', input);
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
@import '@/scss/meallistmobile2.scss';
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
