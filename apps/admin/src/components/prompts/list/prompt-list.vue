<template>
  <v-card flat tile>
    <v-toolbar color="grey lighten-2" flat tile>
      <v-icon color="primary" left>far fa-question-circle</v-icon>
      <v-toolbar-title class="font-weight-medium">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!isOverrideMode"
        color="secondary"
        fab
        small
        :title="$t('survey-schemes.questions.create')"
        @click.stop="create"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
      <options-menu>
        <load-prompt-dialog
          :items="isOverrideMode ? templates : undefined"
          :question-ids="questionIds"
          :scheme-id="$route.params.id"
          @load="load"
        ></load-prompt-dialog>
        <json-editor v-model="questions"></json-editor>
      </options-menu>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="questions" handle=".drag-and-drop__handle" @end="update">
        <transition-group name="drag-and-drop" type="transition">
          <prompt-list-item
            v-for="(question, index) in questions"
            :key="question.id"
            v-bind="{ mode, question, index, templates }"
            :move-sections="moveSections(question)"
            @question:edit="edit"
            @question:move="move"
            @question:remove="remove"
            @question:sync="sync"
          >
          </prompt-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <prompt-selector ref="selector" v-bind="{ mode, section, questionIds }" @save="save">
    </prompt-selector>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';

import type { Prompt } from '@intake24/common/prompts';
import type { MealSection, SurveyQuestionSection } from '@intake24/common/schemes';
import { OptionsMenu } from '@intake24/admin/components/dialogs';
import { JsonEditor } from '@intake24/admin/components/editors';
import { promptSettings } from '@intake24/admin/components/prompts';

import PromptSelector from '../prompt-selector.vue';
import LoadPromptDialog from './load-prompt-dialog.vue';
import PromptListItem from './prompt-list-item.vue';

export type MoveSection = { value: string; text: string };

export type PromptQuestionEvent = {
  index: number;
  question: Prompt;
};

export interface PromptQuestionMoveEvent extends PromptQuestionEvent {
  section: MealSection | SurveyQuestionSection;
}

export default defineComponent({
  name: 'PromptList',

  components: {
    draggable,
    JsonEditor,
    LoadPromptDialog,
    OptionsMenu,
    PromptListItem,
    PromptSelector,
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
    templates: {
      type: Array as PropType<Prompt[]>,
      default: () => [],
    },
    items: {
      type: Array as PropType<Prompt[]>,
      required: true,
    },
  },

  emits: ['update:items', 'move'],

  setup() {
    const selector = ref<InstanceType<typeof PromptSelector>>();

    return { selector };
  },

  data() {
    return {
      questions: this.items,
      promptSettings,
    };
  },

  computed: {
    isOverrideMode(): boolean {
      return this.mode === 'override';
    },
    title(): string {
      return this.$t(
        this.isOverrideMode
          ? `survey-schemes.overrides.questions.title`
          : `survey-schemes.questions.${this.section}.title`
      ).toString();
    },
  },

  watch: {
    items(val) {
      if (isEqual(val, this.questions)) return;

      this.questions = [...val];
    },
    questions() {
      this.update();
    },
  },

  methods: {
    create() {
      if (this.isOverrideMode) return;

      this.selector?.create();
    },

    load(question: Prompt) {
      this.questions.push(question);
    },

    edit({ question, index }: PromptQuestionEvent) {
      this.selector?.edit(index, question);
    },

    save({ question, index }: PromptQuestionEvent) {
      if (index === -1) this.questions.push(question);
      else this.questions.splice(index, 1, question);
    },

    moveSections(question: Prompt): MoveSection[] {
      return this.promptSettings[question.component].sections
        .filter((item) => item !== this.section)
        .map((item) => ({
          value: item,
          text: this.$t(`survey-schemes.questions.${item}.title`).toString(),
        }));
    },

    move(event: PromptQuestionMoveEvent) {
      if (this.isOverrideMode) return;

      this.$emit('move', event);
      this.questions.splice(event.index, 1);
    },

    remove(index: number) {
      this.questions.splice(index, 1);
    },

    sync({ question, index }: PromptQuestionEvent) {
      if (this.isOverrideMode) return;

      this.questions.splice(index, 1, question);
    },

    update() {
      this.$emit('update:items', this.questions);
    },
  },
});
</script>
