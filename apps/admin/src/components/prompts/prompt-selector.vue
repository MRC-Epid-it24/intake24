<template>
  <v-dialog
    v-model="dialog.show"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar color="primary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="reset">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`survey-schemes.questions.${dialog.index === -1 ? 'create' : 'edit'}`) }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text :title="$t('common.action.ok')" @click.stop="save">
            <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
          </v-btn>
        </v-toolbar-items>
        <template #extension>
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
                    <v-toolbar color="grey lighten-4" flat>
                      <v-toolbar-title>
                        <v-icon left>fas fa-fingerprint</v-icon>
                        {{ $t('survey-schemes.questions.internal._') }}
                      </v-toolbar-title>
                    </v-toolbar>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="dialog.question.id"
                            :disabled="isOverrideMode"
                            hide-details="auto"
                            :label="$t('survey-schemes.questions.internal.id._')"
                            :messages="$t('survey-schemes.questions.internal.id.hint')"
                            outlined
                            :readonly="dialog.question.type !== 'custom'"
                            :rules="questionIdRules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="dialog.question.name"
                            :disabled="isOverrideMode"
                            hide-details="auto"
                            :label="$t('survey-schemes.questions.internal.name._')"
                            :messages="$t('survey-schemes.questions.internal.name.hint')"
                            outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>
                <v-col v-if="!isOverrideMode" cols="12">
                  <v-card outlined>
                    <v-toolbar color="grey lighten-4" flat>
                      <v-toolbar-title>
                        <v-icon left>fas fa-circle-question</v-icon>
                        {{ $t(`survey-schemes.questions.type`) }}
                      </v-toolbar-title>
                      <template #extension>
                        <v-tabs v-model="questionTypeTab">
                          <v-tab
                            v-for="type in Object.keys(availableGroupedPromptQuestions)"
                            :key="type"
                            class="font-weight-medium"
                          >
                            {{ $t(`survey-schemes.questions.${type}._`) }}
                          </v-tab>
                        </v-tabs>
                      </template>
                    </v-toolbar>
                    <v-item-group
                      v-model="dialog.question.component"
                      active-class="secondary"
                      @change="updatePromptProps"
                    >
                      <v-tabs-items v-model="questionTypeTab">
                        <prompt-type-selector
                          v-for="(questions, type) in availableGroupedPromptQuestions"
                          :key="type"
                          :questions="questions"
                          :type="type"
                        ></prompt-type-selector>
                      </v-tabs-items>
                    </v-item-group>
                  </v-card>
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
            <v-btn class="font-weight-bold" color="info" text type="submit">
              <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import pick from 'lodash/pick';
import { defineComponent, ref } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { PromptQuestion, QuestionType } from '@intake24/common/prompts';
import type { MealSection, SurveyQuestionSection } from '@intake24/common/schemes';
import {
  customPrompts,
  portionSizePrompts,
  promptSettings,
  standardPrompts,
} from '@intake24/admin/components/prompts';
import {
  customPromptQuestions,
  portionSizePromptQuestions,
  standardPromptQuestions,
} from '@intake24/common/prompts';
import { copy, merge } from '@intake24/common/util';

import { LanguageSelector } from '../forms';
import PromptTypeSelector from './prompt-type-selector.vue';

export interface EditPromptQuestion extends PromptQuestion {
  origId?: string;
}

export type PromptQuestionDialog = {
  show: boolean;
  index: number;
  question: EditPromptQuestion;
};

export default defineComponent({
  name: 'PromptSelector',

  components: {
    LanguageSelector,
    PromptTypeSelector,
    ...customPrompts,
    ...standardPrompts,
    ...portionSizePrompts,
  },

  props: {
    mode: {
      type: String as PropType<'full' | 'override'>,
      default: 'full',
    },
    section: {
      type: String as PropType<SurveyQuestionSection | MealSection>,
    },
    questionIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },

  setup() {
    const form = ref<InstanceType<typeof HTMLFormElement>>();

    return { form };
  },

  data() {
    const promptQuestions = [
      ...customPromptQuestions,
      ...standardPromptQuestions,
      ...portionSizePromptQuestions,
    ];

    const groupedPromptQuestions: Record<QuestionType, PromptQuestion[]> = {
      custom: customPromptQuestions,
      standard: standardPromptQuestions,
      'portion-size': portionSizePromptQuestions,
    };

    const dialog: PromptQuestionDialog = {
      show: false,
      index: -1,
      question: copy(promptQuestions[0]),
    };

    return {
      dialog,
      promptQuestions,
      groupedPromptQuestions,
      promptSettings,
      tab: 0,
      questionTypeTab: 0,
    };
  },

  computed: {
    isOverrideMode(): boolean {
      return this.mode === 'override';
    },
    availablePromptQuestions(): PromptQuestion[] {
      const { section } = this;
      if (!section) return this.promptQuestions;

      return this.promptQuestions.filter((prompt) =>
        this.promptSettings[prompt.component].sections.includes(section)
      );
    },
    availableGroupedPromptQuestions(): Record<QuestionType, PromptQuestion[]> {
      const { section } = this;
      if (!section) return this.groupedPromptQuestions;

      return Object.entries(this.groupedPromptQuestions).reduce((acc, [key, value]) => {
        acc[key as QuestionType] = value.filter((prompt) =>
          this.promptSettings[prompt.component].sections.includes(section)
        );
        return acc;
      }, {} as Record<QuestionType, PromptQuestion[]>);
    },

    questionIdRules(): RuleCallback[] {
      return [
        (value: string | null): boolean | string => {
          const { origId } = this.dialog.question;
          const match = this.questionIds.find((id) => id === value && id !== origId);

          return !match || 'Question ID is already used.';
        },
      ];
    },
  },

  mounted() {
    document.addEventListener('focusin', this.focusInTox, true);
  },

  beforeDestroy() {
    document.removeEventListener('focusin', this.focusInTox, true);
  },

  methods: {
    newDialog(show = false): PromptQuestionDialog {
      return {
        show,
        index: -1,
        question: copy(this.availablePromptQuestions[0]),
      };
    },

    focusInTox(event: FocusEvent) {
      const toxDialog = (event.target as HTMLElement).closest('.tox-dialog');
      if (!toxDialog) return;

      event.stopImmediatePropagation();
    },

    updatePromptProps() {
      const { show, index, question } = this.dialog;
      const { origId, id, name, component } = question;

      const newQuestion =
        this.availablePromptQuestions.find((item) => item.component === component) ??
        this.availablePromptQuestions[0];
      if (!newQuestion) return;

      const propsKeys = Object.keys(newQuestion.props);
      const originalProps = pick(question.props, propsKeys);
      const { props, ...rest } = copy(newQuestion);

      this.dialog = {
        show,
        index,
        question: { ...rest, origId, id, name, props: merge(props, originalProps) },
      };
    },

    updateQuestionTypeTab(type: PromptQuestion['type']) {
      switch (type) {
        case 'standard':
          this.questionTypeTab = 1;
          break;
        case 'portion-size':
          this.questionTypeTab = 2;
          break;
        default:
          this.questionTypeTab = 0;
      }
    },

    create() {
      this.dialog = this.newDialog(true);
      this.updateQuestionTypeTab(this.dialog.question.type);
    },

    edit(index: number, question: PromptQuestion) {
      const promptDefaults = this.promptQuestions.find((q) => q.component === question.component);
      if (!promptDefaults) {
        console.warn(`Prompt defaults for question type '${question.component}' not found.`);
        return;
      }

      this.updateQuestionTypeTab(question.type);

      this.dialog = {
        show: true,
        index,
        question: { origId: question.id, ...merge(promptDefaults, question) },
      };
    },

    save() {
      const isValid = this.form?.validate();
      if (!isValid) return;

      const {
        index,
        question: { origId, ...rest },
      } = this.dialog;

      this.$emit('save', { question: rest, index });

      this.reset();
    },

    reset() {
      this.tab = 0;
      this.questionTypeTab = 0;
      this.dialog = this.newDialog();
      this.form?.resetValidation();
    },

    validate() {
      this.form?.validate();
    },
  },
});
</script>
