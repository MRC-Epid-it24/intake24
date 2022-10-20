import { mapActions, mapState } from 'pinia';
import { defineComponent, ref } from 'vue';

import type { ComponentType } from '@intake24/common/prompts';
import type { MealSection, SurveyQuestionSection } from '@intake24/common/schemes';
import type {
  FoodState,
  RecallPromptHandler,
  RequiredLocaleTranslation,
  Selection,
} from '@intake24/common/types';
import type { SchemeEntryResponse } from '@intake24/common/types/http';
import type { MealAction } from '@intake24/survey/components/recall/MealItem.vue';
import type { RecallAction } from '@intake24/survey/components/recall/MealListDesktop.vue';
import type { PromptInstance } from '@intake24/survey/dynamic-recall/dynamic-recall';
import type { FoodUndo, MealUndo } from '@intake24/survey/stores';
import { isSelectionEqual } from '@intake24/common/types';
import { InfoAlert } from '@intake24/survey/components/elements';
import CustomPromptHandler from '@intake24/survey/components/prompts/dynamic/handlers/CustomPromptHandler.vue';
import portionSizeHandlers from '@intake24/survey/components/prompts/dynamic/handlers/portion-size';
import standardHandlers from '@intake24/survey/components/prompts/dynamic/handlers/standard';
import DynamicRecall from '@intake24/survey/dynamic-recall/dynamic-recall';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndex, getMealIndex } from '@intake24/survey/stores/meal-food-utils';

interface SavedState {
  prompt: PromptInstance | null;
  selection: Selection;
}

export default defineComponent({
  name: 'RecallMixin',

  components: {
    CustomPromptHandler,
    InfoAlert,
    ...standardHandlers,
    ...portionSizeHandlers,
  },

  setup() {
    const promptHandle = ref<RecallPromptHandler>();

    return { promptHandle };
  },

  data: () => {
    const survey = useSurvey();

    return {
      survey,
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
      savedState: null as SavedState | null,
      continueButtonEnabled: false,
      submitTrigger: false,
      hideCurrentPrompt: false,
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedMealOptional', 'hasMeals', 'meals']),

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

    surveyScheme(): SchemeEntryResponse | undefined {
      return this.survey.parameters?.surveyScheme;
    },

    surveyName(): string | undefined {
      return this.survey.parameters?.name;
    },

    surveyId(): string | undefined {
      return this.survey.parameters?.id;
    },

    undo(): MealUndo | FoodUndo | null {
      return this.survey.undo;
    },

    showMealList(): boolean {
      // FIXME: decide on where to put prompts that are not connected to the main flow or refactor this.
      return (
        this.currentPrompt?.section !== 'preMeals' ||
        this.currentPrompt.prompt.component === 'meal-add-prompt'
      );
    },

    foods(): FoodState[] | [] {
      return this.selectedMealOptional ? this.selectedMealOptional.foods : [];
    },

    activePrompt(): RequiredLocaleTranslation | undefined {
      return this.currentPrompt?.prompt.props.name || { en: 'Prompt name missing!' };
    },
  },

  async created() {
    if (!this.surveyScheme) {
      console.error('Survey scheme must be known at this point');
      return;
    }

    this.recallController = new DynamicRecall(this.surveyScheme, this.survey);

    await this.recallController.initialiseSurvey();
  },

  async mounted() {
    await this.nextPrompt();
  },

  methods: {
    ...mapActions(useSurvey, ['deleteMeal', 'setContinueButtonEnabled']),

    setSelection(newSelection: Selection) {
      if (isSelectionEqual(this.survey.data.selection, newSelection)) return;

      // Prevent the currently active prompt from crashing if it expects a different selection type
      this.currentPrompt = null;
      this.survey.setSelection(newSelection);
    },

    clearUndo() {
      // FIXME: Stop components from re-rendering after clearing objectrs in vuex store.
      this.survey.clearUndo();
    },

    showMealPrompt(mealId: number, promptSection: MealSection, promptType: ComponentType) {
      this.setSelection({
        element: {
          type: 'meal',
          mealId,
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

    saveCurrentState() {
      // Don't save state if switching between special prompts
      if (this.savedState !== null) return;

      this.savedState = {
        selection: this.survey.selection,
        prompt: this.currentPrompt,
      };
    },

    clearSavedState() {
      this.savedState = null;
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

    async onMealAction(payload: { action: MealAction; mealId: number }) {
      // eslint-disable-next-line default-case
      switch (payload.action) {
        case 'edit-foods':
          this.showMealPrompt(payload.mealId, 'preFoods', 'edit-meal-prompt');
          break;
        case 'edit-time':
          this.showMealPrompt(payload.mealId, 'preFoods', 'meal-time-prompt');
          break;
        case 'delete-meal':
          console.log('About to delete the Meal: ', payload.mealId);
          this.deleteMeal(payload.mealId);
          await this.nextPrompt();
          break;
      }
    },

    onRecallAction(action: RecallAction) {
      // eslint-disable-next-line default-case
      switch (action) {
        case 'add-meal':
          this.saveCurrentState();
          this.showSurveyPrompt('preMeals', 'meal-add-prompt');
          break;
        case 'review-confirm':
          this.saveCurrentState();
          this.showSurveyPrompt('submission', 'review-confirm-prompt');
          break;
      }
    },

    onBottomNavClick(item: string) {
      this.activeItem = item;
    },

    async onMealSelected(mealId: number) {
      this.setSelection({
        element: {
          type: 'meal',
          mealId,
        },
        mode: 'manual',
      });

      await this.nextPrompt();
    },

    async onFoodSelected(foodId: number) {
      this.setSelection({
        element: {
          type: 'food',
          foodId,
        },
        mode: 'manual',
      });

      await this.nextPrompt();
    },

    isSavedStateValid(): boolean {
      if (this.savedState == null) return false;

      const selection = this.savedState.selection;

      // No element selected means only survey prompts are applicable
      // that are always valid
      if (selection.element == null) return true;

      // Otherwise, make sure selected element id is still valid (it could have been
      // deleted since the state was saved)
      if (selection.element.type == 'food')
        return getFoodIndex(this.survey.meals, selection.element.foodId) !== undefined;
      else return getMealIndex(this.survey.meals, selection.element.mealId) !== undefined;
    },

    async nextPrompt() {
      // Special-case prompts like the mobile review save the current state when they are triggered
      // by user actions.

      // If a saved state exists, then use it as the next prompt (i.e., go back to the prompt that
      // was active before.

      if (this.savedState != null && this.isSavedStateValid()) {
        console.debug(`Using saved state ${this.savedState.prompt?.prompt.component}`);
        this.setSelection(this.savedState.selection);
        this.currentPrompt = this.savedState.prompt;
        this.savedState = null;
      } else {
        this.savedState = null;

        const nextPrompt = this.recallController
          ? this.recallController.getNextPrompt()
          : undefined;

        if (nextPrompt === undefined) {
          // TODO: handle completion
          console.log('No prompts remaining');
          if (this.hasMeals === 0) {
            this.onRecallAction('add-meal');
          } else {
            this.currentPrompt = null;
          }
        } else {
          this.setContinueButtonEnabled(false);
          console.debug(`Switching prompt to ${nextPrompt.prompt.component}`);
          this.currentPrompt = nextPrompt;
        }
      }
    },

    updateValidation(valid: boolean) {
      this.continueButtonEnabled = valid;
    },

    async onContinue() {
      this.continueButtonEnabled = false;
      // Workaround for a crash that occurs if the currently selected prompt changes something
      // in the recall data that makes it incompatible, for example changing from 'free-text'
      // food entry type to 'encoded-food' in commitAnswer.
      //
      // In the current implementation an update/render event is triggered before the nextPrompt
      // function is executed, because most prompts have a reactive dependency on the currently
      // selected food.
      //
      // The correct implementation would be re-evaluating the current prompt type immediately
      // (via the reactivity system) in response to changes in commitAnswer.
      this.hideCurrentPrompt = true;

      await this.promptHandle?.commitAnswer();
      await this.nextPrompt();

      this.hideCurrentPrompt = false;
    },

    // Same as onContinue but don't commit, for alternative prompt actions such as delete meal
    async onComplete() {
      this.continueButtonEnabled = false;
      this.hideCurrentPrompt = true;

      await this.nextPrompt();

      this.hideCurrentPrompt = false;
    },

    async restart() {
      useSurvey().clearState();
      await this.recallController?.initialiseSurvey();
      await this.nextPrompt();
    },
  },
});
