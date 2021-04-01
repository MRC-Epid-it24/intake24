<template>
  <v-row justify="center">
    <v-col v-if="!isNotDesktop" cols="4" md="2">
      <v-card min-height="30rem" class="d-flex justify-center align-center">
        <meal-list :surveyName="survey.name" :meals="recall.meals"></meal-list>
      </v-card>
    </v-col>
    <v-col cols="12" md="10">
      <v-card min-height="30rem" class="d-flex justify-center align-center">
        <!-- <v-btn class="pa-10" color="success" x-large @click="startRecall">Start recall</v-btn> -->
        <!-- <meal-time-prompt
					:props= {

					}
				></meal-time-prompt> -->
      </v-card>
    </v-col>

    <meal-list-mobile :meals="recall.meals"> </meal-list-mobile>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import recall from '@/util/Recall';
import { SurveyEntryResponse } from '@common/types/http';
import standardPromts from '@/components/prompts/standard';
import MealList from '../../components/recall/MealListDesktop.vue';
import MealListMobile from '../../components/recall/MealListMobile.vue';

export default Vue.extend({
  name: 'RecallMeals_test',

  components: {
    MealListMobile,
    MealList,
    ...standardPromts,
  },

  props: {
    surveyId: {
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
  },

  async mounted() {
    if (this.survey?.scheme) this.recall.init(this.survey.scheme);
    // MockData For Test
    // recall.meals.forEach(meal => {
    // 	meal.foods = this.foodTest;
    // });
  },

  methods: {
    startRecall() {
      console.log('Survey scheme:');
      console.log(this.survey?.scheme);
      if (!this.recall.isInitialized()) return;

      const selection = this.recall.start();
      console.log(this.recall);
      console.log(this.survey);
      if (!selection) return;

      this.$router.push({
        name: `recall-${selection.section}`,
        params: { surveyId: this.surveyId, questionId: selection.prompt.question.id },
      });
    },
  },
});
</script>

<style lang="scss"></style>
