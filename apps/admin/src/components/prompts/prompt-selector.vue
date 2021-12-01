<template>
  <v-dialog v-model="dialog.show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card tile>
      <v-toolbar dark color="primary">
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="reset">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`schemes.questions.${dialog.index === -1 ? 'create' : 'edit'}`) }}
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
                <v-col cols="12" v-if="!isOverrideMode">
                  <v-card outlined>
                    <v-toolbar color="grey lighten-4" flat>
                      <v-toolbar-title>{{ $t(`schemes.questions.type`) }}</v-toolbar-title>
                      <template v-slot:extension>
                        <v-tabs v-model="questionTypeTab">
                          <v-tab
                            v-for="type in Object.keys(availablePromptQuestions)"
                            :key="type"
                            class="font-weight-medium"
                          >
                            {{ $t(`schemes.questions.${type}._`) }}
                          </v-tab>
                        </v-tabs>
                      </template>
                    </v-toolbar>
                    <v-item-group
                      active-class="secondary"
                      v-model="dialog.question.component"
                      @change="updatePromptProps"
                    >
                      <v-tabs-items v-model="questionTypeTab">
                        <prompt-type-selector
                          v-for="(questions, type) in availablePromptQuestions"
                          :key="type"
                          :type="type"
                          :questions="questions"
                        ></prompt-type-selector>
                      </v-tabs-items>
                    </v-item-group>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="dialog.question.id"
                    :disabled="isOverrideMode"
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
                    :disabled="isOverrideMode"
                    :label="$t('schemes.questions.name')"
                    hide-details="auto"
                    messages="Descriptive name for better orientation"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="justify-end">
                <v-col cols="12" md="6">
                  <language-selector
                    :label="$t('schemes.questions.localName')"
                    :value="dialog.question.localName"
                    @input="updateLocales({ field: 'localName', value: $event })"
                  >
                    <template
                      v-for="lang in Object.keys(dialog.question.localName)"
                      v-slot:[`lang.${lang}`]
                    >
                      <v-text-field
                        :key="lang"
                        v-model="dialog.question.localName[lang]"
                        :rules="textRules"
                        :disabled="isOverrideMode"
                        :label="$t('schemes.questions.localName')"
                        hide-details="auto"
                        messages="Localized name"
                        outlined
                      ></v-text-field>
                    </template>
                  </language-selector>
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
</template>

<script lang="ts">
import { copy, merge } from '@common/util';
import Vue, { VueConstructor } from 'vue';
import { SurveyQuestionSection, MealSection } from '@common/schemes';
import { FormRefs, LocaleTranslation } from '@common/types';
import {
  PromptQuestion,
  QuestionType,
  customPromptQuestions,
  portionSizePromptQuestions,
  standardPromptQuestions,
} from '@common/prompts';
import { promptSettings } from '@/components/prompts';
import customPrompts from '@/components/prompts/custom';
import standardPrompts from '@/components/prompts/standard';
import portionSizePrompts from '@/components/prompts/portion-size';
import PromptTypeSelector from './prompt-type-selector.vue';
import LanguageSelector from './partials/LanguageSelector.vue';

export interface EditPromptQuestion extends PromptQuestion {
  origId?: string;
}

export type PromptQuestionDialog = {
  show: boolean;
  index: number;
  question: EditPromptQuestion;
};

type ChangeQuestionFieldLocale = {
  field: keyof EditPromptQuestion;
  value: LocaleTranslation;
};

export default (Vue as VueConstructor<Vue & FormRefs>).extend({
  name: 'QuestionListDialog',

  props: {
    mode: {
      type: String as () => 'full' | 'override',
      default: 'full',
    },
    section: {
      type: String as () => SurveyQuestionSection | MealSection,
    },
    questionIds: {
      type: Array as () => string[],
      default: () => [],
    },
    textRequired: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    PromptTypeSelector,
    ...customPrompts,
    ...standardPrompts,
    ...portionSizePrompts,
    LanguageSelector,
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

    const dialog = (show = false): PromptQuestionDialog => ({
      show,
      index: -1,
      question: copy(promptQuestions[0]),
    });

    return {
      dialog: dialog(),
      newDialog: dialog,
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
    textRules() {
      return this.textRequired
        ? [
            (value: string | null): boolean | string =>
              !!value || 'Question localized name is required.',
          ]
        : [];
    },
    availablePromptQuestions(): Record<QuestionType, PromptQuestion[]> {
      const { section } = this;
      if (!section) return this.groupedPromptQuestions;

      return Object.entries(this.groupedPromptQuestions).reduce((acc, [key, value]) => {
        acc[key as QuestionType] = value.filter((prompt) =>
          this.promptSettings[prompt.component].sections.includes(this.section)
        );
        return acc;
      }, {} as Record<QuestionType, PromptQuestion[]>);
    },

    questionIdRules() {
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
    focusInTox(event: FocusEvent) {
      const toxDialog = (event.target as HTMLElement).closest('.tox-dialog');
      if (!toxDialog) return;

      event.stopImmediatePropagation();
    },

    updatePromptProps() {
      const {
        show,
        index,
        question: { id, component },
      } = this.dialog;

      const question = this.promptQuestions.find((item) => item.component === component);
      if (!question) return;

      this.dialog = { show, index, question: { origId: id, ...copy(question) } };
    },

    create() {
      this.dialog = this.newDialog(true);
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

      this.$emit('save', { question: rest, index });

      this.reset();
    },

    reset() {
      this.tab = 0;
      this.questionTypeTab = 0;
      this.dialog = this.newDialog();
      this.$refs.form.resetValidation();
    },

    validate() {
      this.$refs.form.validate();
    },

    updateLocales(changeField: ChangeQuestionFieldLocale) {
      console.log('update-emitted', changeField.value, ' - ', changeField.field);
      const newQuestion: EditPromptQuestion = {
        ...this.dialog.question,
        [changeField.field]: changeField.value,
      };
      this.dialog.question = newQuestion;
    },
  },
});
</script>
