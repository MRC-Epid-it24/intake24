<template>
  <v-card flat tile>
    <v-toolbar flat tile color="grey lighten-2">
      <v-icon class="mr-3" color="primary">far fa-question-circle</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`schemes.questions.${section}.title`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        class="mr-3"
        color="secondary"
        :title="$t('schemes.questions.add')"
        @click.stop="add"
      >
        <v-icon small>fa-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="questions" @end="update">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(question, idx) in questions"
            :key="question.id"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar>
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ question.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ `ID: ${question.id} | Type: ${question.component}` }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <confirm-dialog
                :label="$t('schemes.questions.move')"
                color="primary lighten-1"
                icon
                icon-left="fa-exchange-alt"
                max-width="450px"
                @close="clearMoveToSection"
                @confirm="move(idx)"
              >
                <v-select
                  v-model="moveToSection"
                  :items="moveSectionList(question)"
                  :label="$t('schemes.questions.section')"
                  hide-details="auto"
                  outlined
                ></v-select>
              </confirm-dialog>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn icon :title="$t('schemes.questions.edit')" @click.stop="edit(idx, question)">
                <v-icon color="primary lighten-1">fa-ellipsis-v</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn icon :title="$t('schemes.questions.remove')" @click.stop="remove(idx)">
                <v-icon color="error">$delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card tile>
        <v-toolbar dark color="primary">
          <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="reset">
            <v-icon>$cancel</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ $t(`schemes.questions.${dialog.index === -1 ? 'add' : 'edit'}`) }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn :title="$t('common.action.ok')" dark text @click.stop="save">
              <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
            </v-btn>
          </v-toolbar-items>
          <template v-slot:extension>
            <v-container>
              <v-tabs v-model="tab" background-color="primary" dark>
                <v-tab v-for="item in promptSettings[dialog.question.component].tabs" :key="item">
                  {{ item }}
                </v-tab>
              </v-tabs>
            </v-container>
          </template>
        </v-toolbar>

        <v-form ref="form" @submit.prevent="save">
          <v-container>
            <v-tabs-items v-model="tab" class="pt-1">
              <v-tab-item key="general">
                <v-row>
                  <v-col cols="12">
                    <v-card outlined>
                      <v-card-subtitle>{{ $t(`schemes.questions.type`) }}</v-card-subtitle>
                      <v-tabs v-model="questionTypeTab">
                        <v-tab key="custom">{{ $t(`schemes.questions.custom._`) }}</v-tab>
                        <v-tab key="standard">{{ $t(`schemes.questions.standard._`) }}</v-tab>
                        <v-tab key="portionSize">{{ $t(`schemes.questions.portionSize._`) }}</v-tab>
                      </v-tabs>
                      <v-item-group
                        mandatory
                        active-class="secondary"
                        v-model="selectedQuestionType"
                      >
                        <v-tabs-items v-model="questionTypeTab">
                          <v-tab-item key="custom">
                            <question-type-selector
                              :available-questions="availableCustomQuestions"
                              :empty-alert="$t(`schemes.questions.custom.noQuestions`)"
                              @update-question="setQuestionType"
                            />
                          </v-tab-item>
                          <v-tab-item key="standard">
                            <question-type-selector
                              :available-questions="availableStandardQuestions"
                              :empty-alert="$t(`schemes.questions.standard.noQuestions`)"
                              @update-question="setQuestionType"
                          /></v-tab-item>
                          <v-tab-item key="portionSize">
                            <question-type-selector
                              :available-questions="availablePortionSizeQuestions"
                              :empty-alert="$t(`schemes.questions.portionSize.noQuestions`)"
                              @update-question="setQuestionType"
                            />
                          </v-tab-item>
                        </v-tabs-items>
                      </v-item-group>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="dialog.question.id"
                      :readonly="dialog.question.type !== 'custom'"
                      :label="$t('schemes.questions.id')"
                      :rules="questionIdRules"
                      hide-details="auto"
                      messages="Unique identifier, used e.g. in data-exports as header"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="dialog.question.name"
                      :label="$t('schemes.questions.name')"
                      hide-details="auto"
                      messages="Descriptive name for better orientation"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-tab-item>
              <component
                :is="dialog.question.component"
                v-bind.sync="dialog.question.props"
                @validate="validate"
              ></component>
            </v-tabs-items>
            <v-card-actions>
              <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
                <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
                <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import clone from 'lodash/cloneDeep';
import Vue, { VueConstructor } from 'vue';
import draggable from 'vuedraggable';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { promptSettings } from '@/components/prompts';
import customPrompts from '@/components/prompts/custom';
import standardPrompts from '@/components/prompts/standard';
import portionSizePrompts from '@/components/prompts/portion-size';
import { merge } from '@/util';
import {
  FormRefs,
  PromptQuestion,
  QuestionSection,
  MealSection,
  portionSizePromptQuestions,
} from '@common/types';
import { customPromptQuestions, standardPromptQuestions } from '@common/prompts';
import QuestionTypeSelector from '@/views/schemes/QuestionTypeSelector.vue';

export interface EditPromptQuestion extends PromptQuestion {
  origId?: string;
}

export type PromptQuestionDialog = {
  show: boolean;
  index: number;
  question: EditPromptQuestion;
};

export default (Vue as VueConstructor<Vue & FormRefs>).extend({
  name: 'QuestionList',

  props: {
    section: {
      type: String as () => QuestionSection | MealSection,
    },
    refScheme: {
      type: Array as () => PromptQuestion[],
      default: () => [],
    },
    items: {
      type: Array as () => PromptQuestion[],
      default: () => [],
    },
  },

  components: {
    QuestionTypeSelector,
    ConfirmDialog,
    draggable,
    ...customPrompts,
    ...standardPrompts,
    ...portionSizePrompts,
  },

  data() {
    const promptQuestions = [
      ...customPromptQuestions,
      ...standardPromptQuestions,
      ...portionSizePromptQuestions,
    ];

    const dialog = (show = false): PromptQuestionDialog => ({
      show,
      index: -1,
      question: clone(promptQuestions[0]),
    });

    return {
      dialog: dialog(),
      newDialog: dialog,
      questions: this.items,
      customPromptQuestions,
      standardPromptQuestions,
      portionSizePromptQuestions,
      promptQuestions,
      promptSettings,
      tab: null as number | null,
      questionTypeTab: null as number | null,
      moveToSection: null,
      selectedQuestionType: promptQuestions[0].component,
    };
  },

  computed: {
    isCreate(): boolean {
      return this.dialog.index === -1;
    },

    isEdit(): boolean {
      return !this.isCreate;
    },

    availablePromptQuestions(): PromptQuestion[] {
      return this.promptQuestions.filter((prompt) =>
        this.promptSettings[prompt.component].sections.includes(this.section)
      );
    },

    availableCustomQuestions(): PromptQuestion[] {
      return this.customPromptQuestions.filter((prompt) =>
        this.promptSettings[prompt.component].sections.includes(this.section)
      );
    },

    availableStandardQuestions(): PromptQuestion[] {
      return this.standardPromptQuestions.filter((prompt) =>
        this.promptSettings[prompt.component].sections.includes(this.section)
      );
    },

    availablePortionSizeQuestions(): PromptQuestion[] {
      return this.portionSizePromptQuestions.filter((prompt) =>
        this.promptSettings[prompt.component].sections.includes(this.section)
      );
    },

    questionIdRules() {
      return [
        (value: string | null): boolean | string => {
          const { origId } = this.dialog.question;
          const match = this.refScheme.find((item) => item.id === value && item.id !== origId);

          return !match || 'Question ID is already used.';
        },
      ];
    },
  },

  watch: {
    items(val) {
      this.questions = val;
    },
  },

  mounted() {
    document.addEventListener('focusin', this.focusInTox, true);
  },

  beforeDestroy() {
    document.removeEventListener('focusin', this.focusInTox, true);
  },

  methods: {
    focusInTox(event: FocusEvent) {
      const toxDialog = (event.target as HTMLElement).closest('.tox-dialog');
      if (!toxDialog) return;

      event.stopImmediatePropagation();
    },

    setQuestionType(question: PromptQuestion) {
      this.dialog.question.component = question.component;

      this.updatePromptProps();
    },

    updatePromptProps() {
      const {
        show,
        index,
        question: { id, component },
      } = this.dialog;

      const question = this.promptQuestions.find((item) => item.component === component);
      if (!question) return;

      this.dialog = { show, index, question: { origId: id, ...clone(question) } };
    },

    add() {
      this.dialog = this.newDialog(true);
      this.selectedQuestionType = this.dialog.question.component;
    },

    edit(index: number, question: PromptQuestion) {
      const promptDefaults = this.promptQuestions.find((q) => q.component === question.component);

      switch (question.type) {
        case 'standard':
          this.questionTypeTab = 1;
          break;
        case 'portion-size':
          this.questionTypeTab = 2;
          break;
        default:
          this.questionTypeTab = 0;
      }

      // Item group component seems to be overriding this in some cases resulting in the wrong question type being
      // selected. Delaying this seems to fix it, but feels like a hack.
      //
      // To reproduce :
      //
      // 1) Remove the nextTick wrapper below and assign the question type directly
      // 2) Open any question section
      // 3) Click Add question
      // 4) Close new question editing dialog
      // 5) Edit any other question
      //
      // Wrong question type is selected (info-prompt instead of whatever the selected question uses)

      this.$nextTick(() => {
        this.selectedQuestionType = question.component;
      });

      this.dialog = {
        show: true,
        index,
        question: { origId: question.id, ...merge(promptDefaults ?? {}, question) },
      };
    },

    save() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      const {
        index,
        question: { origId, ...rest },
      } = this.dialog;

      if (index === -1) this.questions.push(rest);
      else this.questions.splice(index, 1, rest);

      this.update();
      this.reset();
    },

    moveSectionList(prompt: PromptQuestion): { value: string; text: string }[] {
      return this.promptSettings[prompt.component].sections
        .filter((item) => item !== this.section)
        .map((item) => ({
          value: item,
          text: this.$t(`schemes.questions.${item}.title`) as string,
        }));
    },

    move(index: number) {
      if (!this.moveToSection) return;

      this.$emit('move', {
        section: this.moveToSection,
        question: clone(this.questions[index]),
      });
      this.questions.splice(index, 1);
      this.update();

      // DOM object is destroyed so we have to clear it manually as event can't be emitted anymore
      this.clearMoveToSection();
    },

    clearMoveToSection() {
      this.moveToSection = null;
    },

    remove(index: number) {
      this.questions.splice(index, 1);
      this.update();
    },

    reset() {
      this.tab = null;
      this.questionTypeTab = null;
      this.selectedQuestionType = this.promptQuestions[0].component;
      this.dialog = this.newDialog();
      this.$refs.form.resetValidation();
    },

    update() {
      this.$emit('update:items', this.questions);
    },

    validate() {
      this.$refs.form.validate();
    },
  },
});
</script>
