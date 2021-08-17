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
        class="mx-3"
        color="secondary"
        :title="$t('schemes.questions.create')"
        @click.stop="create"
      >
        <v-icon small>fa-plus</v-icon>
      </v-btn>
      <template-dialog
        :schemeId="$route.params.id"
        :questionIds="questionIds"
        @insert="insertFromTemplate"
      ></template-dialog>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="questions" @end="update">
        <transition-group type="transition" name="drag-and-drop">
          <question-list-item
            v-for="(question, index) in questions"
            :key="question.id"
            v-bind="{ question, index, templates }"
            :moveSections="moveSections(question)"
            @question:edit="edit"
            @question:move="move"
            @question:remove="remove"
            @question:sync="sync"
          >
          </question-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <prompt-selector ref="selector" v-bind="{ section, questionIds }" @save="save">
    </prompt-selector>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import draggable from 'vuedraggable';
import { PromptQuestion } from '@common/prompts';
import { SurveyQuestionSection, MealSection } from '@common/schemes';
import { SchemeQuestionEntry } from '@common/types/http/admin';
import PromptSelector from '@/components/prompts/PromptSelector.vue';
import { promptSettings } from '@/components/prompts';
import QuestionListItem from './question-list-item.vue';
import TemplateDialog from './template-dialog.vue';

export type Refs = {
  $refs: {
    selector: InstanceType<typeof PromptSelector>;
  };
};

export type MoveSection = { value: string; text: string };

export type PromptQuestionEvent = {
  index: number;
  question: PromptQuestion;
};

export interface PromptQuestionMoveEvent extends PromptQuestionEvent {
  section: MealSection | SurveyQuestionSection;
}

export default (Vue as VueConstructor<Vue & Refs>).extend({
  name: 'QuestionList',

  props: {
    section: {
      type: String as () => SurveyQuestionSection | MealSection,
    },
    questionIds: {
      type: Array as () => string[],
      default: () => [],
    },
    templates: {
      type: Array as () => SchemeQuestionEntry[],
      default: () => [],
    },
    items: {
      type: Array as () => PromptQuestion[],
      default: () => [],
    },
  },

  components: {
    PromptSelector,
    QuestionListItem,
    TemplateDialog,
    draggable,
  },

  data() {
    return {
      questions: this.items,
      promptSettings,
    };
  },

  watch: {
    items(val) {
      this.questions = val;
    },
  },

  methods: {
    create() {
      this.$refs.selector.create();
    },

    insertFromTemplate(question: PromptQuestion) {
      this.questions.push(question);
    },

    edit({ question, index }: PromptQuestionEvent) {
      this.$refs.selector.edit(index, question);
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
          text: this.$t(`schemes.questions.${item}.title`).toString(),
        }));
    },

    move(event: PromptQuestionMoveEvent) {
      this.$emit('move', event);
      this.questions.splice(event.index, 1);
      this.update();
    },

    remove(index: number) {
      this.questions.splice(index, 1);
      this.update();
    },

    sync({ question, index }: PromptQuestionEvent) {
      this.questions.splice(index, 1, question);
      this.update();
    },

    update() {
      this.$emit('update:items', this.questions);
    },
  },
});
</script>
