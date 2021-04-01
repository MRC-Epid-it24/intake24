<template>
  <v-row justify="center">
    <v-col cols="4" md="2">
      <v-card min-height="30rem" class="d-flex justify-center align-center">
        <v-navigation-drawer permanent>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title"> Recall </v-list-item-title>
              <v-list-item-subtitle>
                {{ survey.name }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list dense nav>
            <v-list-item v-for="meal in recall.meals" :key="meal.name" link>
              <v-list-item-content>
                <meal-item :name="meal.name" :foods="foodsTest"></meal-item>
                <!-- <v-list-item-title>{{ meal.name }}</v-list-item-title> -->
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
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
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import recall from '@/util/Recall';
import { SurveyEntryResponse } from '@common/types/http';
import standardPromts from '@/components/prompts/standard';
import MealItem from '../../components/elements/MealItem.vue';

export default Vue.extend({
  name: 'RecallMeals_test',

  components: {
    MealItem,
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
      foodsTest: ['Chicken breast', 'Tea', 'muffin'],
    };
  },

  computed: {
    survey(): SurveyEntryResponse | null {
      return this.$store.state.recall.survey;
    },
  },

  async mounted() {
    if (this.survey?.scheme) this.recall.init(this.survey.scheme);
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
