<template>
  <v-row justify="center" class="pa-0">
    <v-col cols="12" class="mealbar stickytop">
      <meal-list-mobile-top :foods="foods" :meals="meals" v-if="isNotDesktop">
      </meal-list-mobile-top>
    </v-col>
    <v-col v-if="!isNotDesktop" cols="3" lg="3" min-height="30rem" height="45rem">
      <meal-list :surveyName="surveyName" :meals="meals"></meal-list>
    </v-col>

    <v-col cols="12" lg="9" class="content">
      <v-toolbar class="mb-4">
        <v-breadcrumbs v-if="!isNotDesktop" :items="brdMeal" divider="/"></v-breadcrumbs>
        <v-spacer v-if="!isNotDesktop"></v-spacer>
        <v-btn @click="$router.back()"> back </v-btn>
      </v-toolbar>
      <transition name="component-fade" mode="out-in">
        <!-- FIXME: Random key is a hacky way to force Vue to re-create the dynamic component on prompt switch
        even if the next prompt uses the same component type, probably should be something like an internal counter,
        or maybe not  ¯\_(ツ)_/¯  -->
        <component
          v-if="currentPrompt"
          ref="promptComponent"
          @hook:mounted="onPromptComponentMounted"
          :is="currentPrompt.prompt.component"
          :promptProps="currentPrompt.promptProps"
          :key="Math.random()"
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
import { SchemeEntryResponse, SurveyEntryResponse } from '@common/types/http';
import customPrompts from '@/components/prompts/custom';
import standardPrompts from '@/components/prompts/standard';
import { conditionOps, PromptAnswer, PromptQuestion } from '@common/prompts';
import { SurveyState } from '@/types/vuex';
import DynamicRecall, { PromptInstance } from '@/dynamic-recall/dynamic-recall';
import MealListMobileBottom from '@/components/recall/MealListMobileBottom.vue';
import MealListMobileTop from '@/components/recall/MealListMobileTop.vue';
import MealList from '@/components/recall/MealListDesktop.vue';
import { MealState2 } from '@common/types';
import MealTimePrompt2 from '@/components/prompts/standard/MealTimePrompt2.vue';
import { mapGetters, mapState } from 'vuex';

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
        return conditionOps[condition.op]([
          condition.value,
          state.data.customPromptAnswers[prompt.id],
        ]);
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
  name: 'DynamicRecall',

  components: {
    MealListMobileBottom,
    MealListMobileTop,
    MealList,
    ...customPrompts,
    MealTimePrompt: MealTimePrompt2,
  },

  data: () => {
    return {
      currentPrompt: null as PromptInstance | null,
      recallController: null as DynamicRecall | null,
    };
  },

  computed: {
    surveyScheme(): SchemeEntryResponse | null {
      return this.$store.state.survey.parameters?.scheme;
    },

    surveyName(): SurveyEntryResponse | null {
      return this.$store.state.survey.parameters?.name;
    },

    showMealList(): boolean {
      return this.currentPrompt?.section !== 'preMeals';
    },

    foods(): any {
      return [];
    },

    brdMeal(): any {
      return [
        {
          text: 'Choose Meal',
          disabled: true,
        },
        {
          text: 'Choose Food',
          disabled: true,
        },
      ];
    },

    ...mapState({
      meals: (state: any) => {
        return state.survey.data.meals.map((meal: MealState2) => {
          return {
            name: meal.name,
            time: meal.time ? `${meal.time.hours}:${meal.time.minutes}` : `?`,
          };
        });
      },
    }),
  },

  async mounted() {
    if (this.surveyScheme == null) {
      console.error('Survey scheme must be known at this point');
      return;
    }

    this.recallController = new DynamicRecall(this.surveyScheme, this.$store);

    await this.recallController.initialiseSurvey();
    await this.nextPrompt();
  },

  methods: {
    async nextPrompt() {
      const nextPrompt = this.recallController!.getNextPrompt();

      if (nextPrompt === undefined) {
        // TODO: handle completion
        console.log('No prompts remaining');
      } else {
        console.log(`Switching prompt to ${nextPrompt.prompt.component}`);
        this.currentPrompt = nextPrompt;
      }
    },

    async onPromptComponentMounted() {
      if (this.$refs.promptComponent instanceof Vue) {
        await this.currentPrompt!.onPromptComponentMounted(
          this.$refs.promptComponent as Vue,
          this.nextPrompt
        );
      } else {
        throw new Error('Expected mounted prompt component to be a Vue instance');
      }
    },
  },
});
</script>
