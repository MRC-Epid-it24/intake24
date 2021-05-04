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
        :title="$t('schemes.questions.new')"
        @click.stop="create"
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
    <prompt-selector ref="selector" :section="section" :questionIds="questionIds" @save="save">
    </prompt-selector>
  </v-card>
</template>

<script lang="ts">
import clone from 'lodash/cloneDeep';
import Vue, { VueConstructor } from 'vue';
import draggable from 'vuedraggable';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { promptSettings } from '@/components/prompts';
import PromptSelector from '@/components/prompts/PromptSelector.vue';
import { PromptQuestion, QuestionSection, MealSection } from '@common/types';

export type Refs = {
  $refs: {
    selector: InstanceType<typeof PromptSelector>;
  };
};

export default (Vue as VueConstructor<Vue & Refs>).extend({
  name: 'QuestionList',

  props: {
    section: {
      type: String as () => QuestionSection | MealSection,
    },
    questionIds: {
      type: Array as () => string[],
      default: () => [],
    },
    items: {
      type: Array as () => PromptQuestion[],
      default: () => [],
    },
  },

  components: {
    ConfirmDialog,
    PromptSelector,
    draggable,
  },

  data() {
    return {
      questions: this.items,
      promptSettings,
      moveToSection: null,
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

    edit(index: number, question: PromptQuestion) {
      this.$refs.selector.edit(index, question);
    },

    save({ question, index }: { question: PromptQuestion; index: number }) {
      if (index === -1) this.questions.push(question);
      else this.questions.splice(index, 1, question);
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

    update() {
      this.$emit('update:items', this.questions);
    },
  },
});
</script>
