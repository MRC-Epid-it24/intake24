<template>
  <v-card flat tile>
    <v-toolbar flat tile color="grey lighten-2">
      <v-icon class="mr-3" color="primary">far fa-question-circle</v-icon>
      <v-toolbar-title class="font-weight-medium">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!isOverrideMode"
        fab
        small
        class="mx-3"
        color="secondary"
        :title="$t('survey-schemes.questions.create')"
        @click.stop="create"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
      <load-prompt-dialog
        :schemeId="$route.params.id"
        :items="isOverrideMode ? templates : undefined"
        :questionIds="questionIds"
        @load="load"
      ></load-prompt-dialog>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="questions" @end="update">
        <transition-group type="transition" name="drag-and-drop">
          <prompt-list-item
            v-for="(question, index) in questions"
            :key="question.id"
            v-bind="{ mode, question, index, templates }"
            :moveSections="moveSections(question)"
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
import isEqual from 'lodash/isEqual';
import { defineComponent, PropType, ref } from '@vue/composition-api';
import draggable from 'vuedraggable';
import { PromptQuestion } from '@intake24/common/prompts';
import { SurveyQuestionSection, MealSection } from '@intake24/common/schemes';
import { promptSettings } from '@intake24/admin/components/prompts';
import LoadPromptDialog from './load-prompt-dialog.vue';
import PromptListItem from './prompt-list-item.vue';
import PromptSelector from '../prompt-selector.vue';

export type MoveSection = { value: string; text: string };

export type PromptQuestionEvent = {
  index: number;
  question: PromptQuestion;
};

export interface PromptQuestionMoveEvent extends PromptQuestionEvent {
  section: MealSection | SurveyQuestionSection;
}

export default defineComponent({
  name: 'PromptList',

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
      type: Array as PropType<PromptQuestion[]>,
      default: () => [],
    },
    items: {
      type: Array as PropType<PromptQuestion[]>,
      required: true,
    },
  },

  components: {
    draggable,
    LoadPromptDialog,
    PromptListItem,
    PromptSelector,
  },

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

    load(question: PromptQuestion) {
      this.questions.push(question);
    },

    edit({ question, index }: PromptQuestionEvent) {
      this.selector?.edit(index, question);
    },

    save({ question, index }: PromptQuestionEvent) {
      if (index === -1) this.questions.push(question);
      else this.questions.splice(index, 1, question);
    },

    moveSections(question: PromptQuestion): MoveSection[] {
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
