<template>
  <v-list-item class="drag-and-drop__item" draggable link>
    <v-list-item-avatar>
      <v-icon>fa-grip-vertical</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ question.name }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ `ID: ${question.id} | Type: ${question.component}` }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if="!!template">
      <v-btn
        :title="$t(`scheme-questions.sync.${isInSyncWithTemplate ? 'true' : 'false'}`)"
        icon
        @click.stop="sync"
      >
        <v-icon :color="isInSyncWithTemplate ? `success` : `warning`">fa-sync</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action>
      <confirm-dialog
        :label="$t('schemes.questions.move')"
        color="primary lighten-1"
        icon
        icon-left="fa-exchange-alt"
        max-width="450px"
        @close="clearMoveToSection"
        @confirm="move"
      >
        <v-select
          v-model="moveToSection"
          :items="moveSections"
          :label="$t('schemes.questions.section')"
          hide-details="auto"
          outlined
        ></v-select>
      </confirm-dialog>
    </v-list-item-action>
    <v-list-item-action>
      <v-btn icon :title="$t('schemes.questions.edit')" @click.stop="edit">
        <v-icon color="primary lighten-1">fa-ellipsis-v</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action>
      <v-btn icon :title="$t('schemes.questions.remove')" @click.stop="remove">
        <v-icon color="error">$delete</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue';
import clone from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { PromptQuestion } from '@common/prompts';
import { MoveSection } from './QuestionList.vue';

export default Vue.extend({
  name: 'QuestionListItem',

  props: {
    question: {
      type: Object as () => PromptQuestion,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    moveSections: {
      type: Array as () => MoveSection[],
      default: () => [],
    },
    templates: {
      type: Array as () => PromptQuestion[],
      default: () => [],
    },
  },

  components: {
    ConfirmDialog,
  },

  data() {
    return {
      moveToSection: null,
    };
  },

  computed: {
    template(): PromptQuestion | undefined {
      return this.templates.find((template) => template.id === this.question.id);
    },

    isInSyncWithTemplate(): boolean {
      return !!this.template && isEqual(this.question, this.template);
    },
  },

  methods: {
    edit() {
      const { index, question } = this;
      this.$emit('question:edit', { index, question });
    },

    move() {
      if (!this.moveToSection) return;

      this.$emit('question:move', {
        section: this.moveToSection,
        index: this.index,
        question: clone(this.question),
      });

      // DOM object is destroyed so we have to clear it manually as event can't be emitted anymore
      this.clearMoveToSection();
    },

    clearMoveToSection() {
      this.moveToSection = null;
    },

    remove() {
      this.$emit('question:remove', this.index);
    },

    sync() {
      if (!this.template || this.isInSyncWithTemplate) return;

      this.$emit('question:sync', {
        question: clone(this.template),
        index: this.index,
      });
    },
  },
});
</script>
