<template>
  <v-row justify="center">
    <v-col v-if="!isNotDesktop" cols="3" lg="3">
      <meal-list
        :surveyName="survey.name"
        :meals="mealsExample"
        @breadcrimbMealUp="setMealbrd"
        @breadcrimbFoodUp="setFoodbrd"
      ></meal-list>
    </v-col>
    <v-col cols="12" lg="9">
      <v-card
        min-height="30rem"
        height="45rem"
        class="flex-grow-1 flex-shrink-0 justify-center align-center"
      >
        <v-breadcrumbs v-if="!isNotDesktop" :items="brdMeal" divider="/"></v-breadcrumbs>
        <!-- <v-btn class="pa-10" color="success" x-large @click="startRecall">Start recall</v-btn> -->
        <!-- <meal-time-prompt
					:props= {

					}
				></meal-time-prompt> -->
      </v-card>
    </v-col>

    <meal-list-mobile :meals="mealsExample" v-if="isNotDesktop"> </meal-list-mobile>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import recall from '@/util/Recall';
import { SurveyEntryResponse } from '@common/types/http';
import standardPromts from '@/components/prompts/standard';
import MealList from '../../components/recall/MealListDesktop.vue';
import MealListMobile from '../../components/recall/mobile_interface1/MealListMobile.vue';

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
      // Mock Data
      foodeExamples: [
        {
          code: 'CHKA23',
          name: 'Chicken breast',
          searchTerm: 'Chicken breast',
          portionSizeMethod: 'asServed',
        },
        {
          code: 'BTEA23',
          name: 'Black Tea',
          searchTerm: 'Tea',
        },
        {
          searchTerm: 'Muffin with berry',
        },
      ],
      meals: [
        {
          name: 'Breakfast',
          time: '8:00',
        },
        {
          name: 'Morning Snack',
          time: '10:00',
        },
        {
          name: 'Lunch',
          time: '12:00',
        },
        {
          name: 'Afternoon Snack',
          time: '14:00',
        },
        {
          name: 'Dinner',
          time: '18:00',
        },
        {
          name: 'Evening Snack',
          time: '21:00',
        },
      ],
    };
  },

  computed: {
    survey(): SurveyEntryResponse | null {
      return this.$store.state.recall.survey;
    },
    // MockData For Test
    mealsExample() {
      const mealsArr: Array<any | null> = [];
      this.meals.forEach((meal) => {
        const mealObj: any = {
          name: meal.name,
          time: Math.random() > 0.5 ? meal.time : '',
        };
        mealObj.foods = mealObj.time ? this.foodeExamples : [];
        mealsArr.push(mealObj);
      });

      return mealsArr;
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
    setMealbrd(e: string) {
      this.brdMeal[0].text = e;
      this.brdMeal[0].disabled = false;
      this.brdMeal[1].text = 'Choose Meal';
      this.brdMeal[1].disabled = true;
    },
    setFoodbrd(e: string) {
      this.brdMeal[1].text = e;
      this.brdMeal[1].disabled = false;
    },
  },
});
</script>

<style lang="scss"></style>
