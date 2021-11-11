import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import { SchemeEntryResponse, SurveyEntryResponse } from '@common/types/http';
import { MealSection, SurveyQuestionSection } from '@common/schemes';
import { MealState, Selection, FoodState } from '@common/types';
import { ComponentType } from '@common/prompts';
import DynamicRecall, { PromptInstance } from '@/dynamic-recall/dynamic-recall';
import RecallBreadCrumbs from '@/components/recall/BreadCrumbs.vue';
import MealList, { RecallAction } from '@/components/recall/MealListDesktop.vue';
import CustomPromptHandler from '@/components/prompts/dynamic/handlers/CustomPromptHandler.vue';
import standardHandlers from '@/components/prompts/dynamic/handlers/standard';
import portionSizeHandlers from '@/components/prompts/dynamic/handlers/portion-size';
import timeDoubleDigitsConvertor from '@/components/mixins/timeDoubleDigitsConvertor';
import { MealAction } from '@/components/recall/MealItem.vue';
import { MealUndo, FoodUndo } from '@/types/vuex';

// Mobile
import MealListMobileBottom from '@/components/recall/mobile/MealListMobileBottom.vue';
import FoodListMobileBottom from '@/components/recall/mobile/FoodListMobileBottom.vue';
import MealFoodMobileContextMenu from '@/components/recall/MobileMealFoodContext.vue';
import RecallBreadCrumbsMobile from '@/components/recall/mobile/BreadCrumbsMobile.vue';
import BottomNavigationMobile from '@/components/recall/mobile/BottomNavMobile.vue';
import InfoAlert from '@/components/elements/InfoAlert.vue';

export default Vue.extend({
  name: 'Recall',

  components: {
    MealListMobileBottom,
    FoodListMobileBottom,
    MealList,
    RecallBreadCrumbs,
    RecallBreadCrumbsMobile,
    MealFoodMobileContextMenu,
    CustomPromptHandler,
    BottomNavigationMobile,
    InfoAlert,
    ...standardHandlers,
    ...portionSizeHandlers,
  },

  data: () => {
    return {
      currentPrompt: null as PromptInstance | null,
      recallController: null as DynamicRecall | null,
      clickedPrompt: null as ComponentType | null,
      mobileMealFoodContextMenu: {
        show: false,
        mealIndex: 0,
        foodIndex: 0,
        foodContext: false,
      },
      activeMeal: '',
      activeFood: '',
      activeItem: 'meal',
      alert: false,
    };
  },

  computed: {
    ...mapGetters('survey', ['selectedMeal', 'selectedFood', 'selectedMealIndex']),

    handlerComponent(): string {
      const prompt = this.currentPrompt?.prompt;

      if (prompt === undefined) throw new Error('Current prompt must be defined');

      switch (prompt.type) {
        case 'custom':
          return 'custom-prompt-handler';
        case 'standard':
        case 'portion-size':
          return `${prompt.component}-handler`;
        default:
          throw new Error(`Unexpected prompt type: ${prompt.type}`);
      }
    },

    surveyScheme(): SchemeEntryResponse | null {
      return this.$store.state.survey.parameters?.scheme;
    },

    surveyName(): SurveyEntryResponse | null {
      return this.$store.state.survey.parameters?.name;
    },

    surveyId(): SurveyEntryResponse | null {
      return this.$store.state.survey.parameters?.id;
    },

    undo(): MealUndo | FoodUndo | null {
      return this.$store.state.survey.undo;
    },

    showMealList(): boolean {
      // FIXME: decide on where to put prompts that are not connected to the main flow or refactor this.
      return (
        this.currentPrompt?.section !== 'preMeals' ||
        this.currentPrompt.prompt.component === 'meal-add-prompt'
      );
    },

    foods(): FoodState[] | [] {
      return this.selectedMeal ? this.selectedMeal.foods : [];
    },

    mealIndex(): number | undefined {
      return this.selectedMealIndex;
    },

    activePrompt(): string {
      return this.currentPrompt ? this.currentPrompt?.prompt.name : '';
    },

    ...mapState({
      meals(state: any) {
        return state.survey.data.meals.map((meal: MealState) => {
          return {
            name: meal.name,
            time: meal.time
              ? timeDoubleDigitsConvertor(meal.time.hours)
                  .concat(':')
                  .concat(timeDoubleDigitsConvertor(meal.time.minutes))
              : ``,
            // FIXME: Foods is type of Encoded USer Food Data or Uswr Food Data. at the mpment FoodItem.vue component is expecting object iwth name and searchTerm properties.
            foods: meal.foods,
          };
        });
      },
    }),
  },

  async created() {
    if (this.surveyScheme === null) {
      console.error('Survey scheme must be known at this point');
      return;
    }

    this.recallController = new DynamicRecall(this.surveyScheme, this.$store);

    await this.recallController.initialiseSurvey();
  },

  async mounted() {
    await this.nextPrompt();
  },

  methods: {
    setSelection(newSelection: Selection) {
      // Prevent the currently active prompt from crashing if it expects a different selection type
      this.currentPrompt = null;
      this.$store.commit('survey/setSelection', newSelection);
    },

    clearUndo() {
      // FIXME: Stop components from re-rendering after clearing objectrs in vuex store.
      this.$store.commit('survey/clearUndo');
    },

    showMealPrompt(mealIndex: number, promptSection: MealSection, promptType: ComponentType) {
      this.setSelection({
        element: {
          type: 'meal',
          mealIndex,
        },
        mode: 'manual',
      });

      const prompt = this.recallController
        ? this.recallController.promptManager.findMealPromptOfType(promptType, promptSection)
        : undefined;

      if (prompt === undefined)
        throw new Error(
          `Survey scheme is missing required meal (preFoods) prompt of type ${promptType}`
        );

      this.currentPrompt = {
        section: promptSection,
        prompt,
      };
    },

    showSurveyPrompt(promptSection: SurveyQuestionSection, promptType: ComponentType) {
      this.setSelection({
        element: null,
        mode: 'manual',
      });

      const prompt = this.recallController
        ? this.recallController.promptManager.findSurveyPromptOfType(promptType, promptSection)
        : undefined;

      if (prompt === undefined)
        throw new Error(
          `Survey scheme is missing required survey (preMeals) prompt of type ${promptType}`
        );

      this.currentPrompt = {
        section: promptSection,
        prompt,
      };
    },

    onMealAction(payload: { action: MealAction; mealIndex: number }) {
      // eslint-disable-next-line default-case
      switch (payload.action) {
        case 'edit-foods':
          this.showMealPrompt(payload.mealIndex, 'preFoods', 'edit-meal-prompt');
          break;
        case 'edit-time':
          this.showMealPrompt(payload.mealIndex, 'preFoods', 'meal-time-prompt');
          break;
      }
    },

    onMealMobileClick(mealIndex: number, name: string, foods: FoodState[]) {
      this.activeMeal = name;
      this.mobileMealFoodContextMenu.foodContext = false;
      this.mobileMealFoodContextMenu.show = !this.mobileMealFoodContextMenu.show;
      this.mobileMealFoodContextMenu.mealIndex = mealIndex;
    },

    onFoodMobileClick(foodIndex: number, mealIndex: number, name: string) {
      this.activeFood = name;
      this.mobileMealFoodContextMenu.foodContext = true;
      this.mobileMealFoodContextMenu.show = !this.mobileMealFoodContextMenu.show;
      this.mobileMealFoodContextMenu.mealIndex = mealIndex;
      this.mobileMealFoodContextMenu.foodIndex = foodIndex;
    },

    onMealFoodMobileClick(
      payload:
        | { mealIndex: number; name: string; foods: FoodState[]; entity: 'meal' }
        | { foodIndex: number; mealIndex: number; name: string; entity: 'food' }
    ) {
      if (payload.entity === 'meal')
        this.onMealMobileClick(payload.mealIndex, payload.name, payload.foods);
      if (payload.entity === 'food')
        this.onFoodMobileClick(payload.foodIndex, payload.mealIndex, payload.name);
    },

    onMobileMealFoodContextMenu() {
      this.mobileMealFoodContextMenu.show = !this.mobileMealFoodContextMenu.show;
    },

    onRecallAction(action: RecallAction) {
      // eslint-disable-next-line default-case
      switch (action) {
        case 'add-meal':
          this.showSurveyPrompt('preMeals', 'meal-add-prompt');
          break;
      }
    },

    onBottomNavClick(item: string) {
      this.activeItem = item;
    },

    async onMealSelected(payload: { mealIndex: number }) {
      this.setSelection({
        element: {
          type: 'meal',
          mealIndex: payload.mealIndex,
        },
        mode: 'manual',
      });

      await this.nextPrompt();
    },

    async onFoodSelected(payload: { mealIndex: number; foodIndex: number }) {
      this.setSelection({
        element: {
          type: 'food',
          mealIndex: payload.mealIndex,
          foodIndex: payload.foodIndex,
        },
        mode: 'manual',
      });

      await this.nextPrompt();
    },

    async nextPrompt() {
      const nextPrompt = this.recallController ? this.recallController.getNextPrompt() : undefined;

      if (nextPrompt === undefined) {
        // TODO: handle completion
        console.log('No prompts remaining');
        this.currentPrompt = null;
      } else {
        console.log(`Switching prompt to ${nextPrompt.prompt.component}`);
        this.currentPrompt = nextPrompt;
      }
    },
  },
});
