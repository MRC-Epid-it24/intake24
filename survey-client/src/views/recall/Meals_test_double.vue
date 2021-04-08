<template>
  <v-row justify="center" class="pa-0">
    <v-col cols="12" class="mealbar stickytop">
      <meal-list-mobile-top
        :foods="foods"
        :meals="mealsExample"
        v-if="isNotDesktop"
        @displayFoods="onMealClick"
      >
      </meal-list-mobile-top>
    </v-col>
    <v-col v-if="!isNotDesktop" cols="3" lg="3">
      <meal-list :surveyName="survey.name" :meals="mealsExample"></meal-list>
    </v-col>
    <v-col cols="12" lg="9" class="content">
      <v-card min-height="30rem" height="45rem" class="justify-center align-center scrollable">
        <p class="ma-2">Some prompts</p>
      </v-card>
    </v-col>
    <v-col cols="12" class="foodbar stickybottom">
      <meal-list-mobile-bottom v-if="isNotDesktop" :loading="false" :foods="foods">
      </meal-list-mobile-bottom>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import recall from '@/util/Recall';
import { SurveyEntryResponse } from '@common/types/http';
import standardPromts from '@/components/prompts/standard';
import MealList from '../../components/recall/MealListDesktop.vue';
import MealListMobileTop from '../../components/recall/mobile_interface2/MealListMobileTop.vue';
import MealListMobileBottom from '../../components/recall/mobile_interface2/MealListMobileBottom.vue';

export default Vue.extend({
  name: 'RecallMeals_test_double',

  components: {
    MealListMobileTop,
    MealListMobileBottom,
    MealList,
    ...standardPromts,
  },

  props: {
    surveyId: {
      type: String,
    },
  },

  data() {
    const foods: any = [];
    return {
      recall,
      foods,
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

    onMealClick(event: Array<any>) {
      this.foods = event;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile2.scss';
</style>
