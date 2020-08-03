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
              <v-btn icon :title="$t('schemes.questions.edit')" @click.stop="edit(idx, question)">
                <v-icon color="primary lighten-2">fa-ellipsis-v</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn icon :title="$t('schemes.questions.remove')" @click.stop="remove(idx)">
                <v-icon color="error">fa-trash</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card tile>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.stop="reset">
            <v-icon>$cancel</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ $t(`schemes.questions.${dialog.index === -1 ? 'add' : 'edit'}`) }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text :title="$t('common.action.save')" @click.stop="save">
              <v-icon left>$save</v-icon>
              {{ $t('common.action.save') }}
            </v-btn>
          </v-toolbar-items>
          <template v-slot:extension>
            <v-container>
              <v-tabs v-model="tab" background-color="primary" dark>
                <v-tab v-for="item in promptTypeTabs[dialog.question.component]" :key="item">
                  {{ item }}
                </v-tab>
              </v-tabs>
            </v-container>
          </template>
        </v-toolbar>

        <v-form ref="form" @submit.prevent="save">
          <v-container>
            <v-tabs-items v-model="tab">
              <v-tab-item key="general">
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="dialog.question.component"
                      :items="promptQuestions"
                      :label="$t('schemes.questions.component')"
                      hide-details="auto"
                      item-value="component"
                      item-text="name"
                      outlined
                      @change="updatePromptProps"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="dialog.question.id"
                      :label="$t('schemes.questions.id')"
                      :rules="questionIdRules"
                      hide-details="auto"
                      hint="Unique identifier, used e.g. in data-exports as header"
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
              <v-spacer></v-spacer>
              <v-btn class="font-weight-bold" color="blue darken-3" text @click.stop="reset">
                {{ $t('common.action.cancel') }}
              </v-btn>
              <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
                {{ $t('common.action.save') }}
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
import { FormRefs } from '@common/types/common';
import { ComponentType, PromptQuestion } from '@common/types/prompts';
import { promptQuestions } from '@common/prompts/promptDefaults';
import prompts from '@/components/prompts';

export interface EditPromptQuestion extends PromptQuestion {
  origId?: string;
}

export type PromptQuestionDialog = {
  show: boolean;
  index: number;
  question: EditPromptQuestion;
};

export type PromptTypeTabs = Record<ComponentType, string[]>;

const promptTypeTabs: PromptTypeTabs = {
  'info-prompt': ['general', 'content'],
  'date-picker-prompt': ['general', 'content', 'validation'],
  'time-picker-prompt': ['general', 'content', 'validation'],
  'checkbox-list-prompt': ['general', 'content', 'validation', 'options'],
  'radio-list-prompt': ['general', 'content', 'validation', 'options'],
  'textarea-prompt': ['general', 'content', 'validation'],
  'submit-prompt': ['general', 'content'],
};

export default (Vue as VueConstructor<Vue & FormRefs>).extend({
  name: 'QuestionList',

  props: {
    section: {
      type: String,
    },
    refScheme: {
      type: Array as () => PromptQuestion[],
      default: [],
    },
    items: {
      type: Array as () => PromptQuestion[],
      default: [],
    },
  },

  components: { draggable, ...prompts },

  data() {
    const dialog = (show = false): PromptQuestionDialog => ({
      show,
      index: -1,
      question: clone(promptQuestions[0]),
    });

    return {
      dialog: dialog(),
      newDialog: dialog,
      questions: this.items,
      promptQuestions,
      promptTypeTabs,
      tab: null,
    };
  },

  computed: {
    isCreate(): boolean {
      return this.dialog.index === -1;
    },
    isEdit(): boolean {
      return !this.isCreate;
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

  methods: {
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
    },

    edit(index: number, question: PromptQuestion) {
      this.dialog = { show: true, index, question: { origId: question.id, ...clone(question) } };
    },

    save() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      const {
        index,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        question: { origId, ...rest },
      } = this.dialog;

      if (index === -1) this.questions.push(rest);
      else this.questions.splice(index, 1, rest);

      this.update();
      this.reset();
    },

    remove(index: number) {
      this.questions.splice(index, 1);
      this.update();
    },

    reset() {
      this.tab = null;
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

<style lang="scss" scoped></style>
