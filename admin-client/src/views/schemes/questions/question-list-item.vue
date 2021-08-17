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
    <v-list-item-content v-if="hasTemplate">
      <v-list-item-subtitle>
        <v-icon :color="isInSyncWithTemplate ? `success` : `warning`" left>fa-sync</v-icon>
        <span color="success">
          {{ $t(`scheme-questions.sync.${isInSyncWithTemplate ? 'true' : 'false'}`) }}
        </span>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon :title="$t('schemes.questions.edit')" @click.stop="edit">
        <v-icon color="primary lighten-1">$edit</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action>
      <v-menu
        v-model="contextMenu"
        max-width="600px"
        offset-y
        close-on-content-click
        close-on-click
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon color="primary lighten-1">fa-ellipsis-v</v-icon>
          </v-btn>
        </template>
        <v-list>
          <confirm-dialog
            :label="$t('schemes.questions.move')"
            color="primary lighten-1"
            max-width="450px"
            @close="clearMoveToSection"
            @confirm="move"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item link v-bind="attrs" v-on="on">
                <v-list-item-title>
                  <v-icon left>fa-exchange-alt</v-icon>
                  {{ $t('schemes.questions.move') }}
                </v-list-item-title>
              </v-list-item>
            </template>
            <v-select
              v-model="moveToSection"
              :items="moveSections"
              :label="$t('schemes.questions.section')"
              hide-details="auto"
              outlined
            ></v-select>
          </confirm-dialog>
          <save-as-template-dialog
            v-if="can('scheme-questions-create')"
            :disabled="hasTemplate"
            :question="question"
          ></save-as-template-dialog>
          <confirm-dialog
            :label="$t('scheme-questions.sync.synchronize')"
            color="primary lighten-1"
            max-width="450px"
            @confirm="sync"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item
                v-bind="attrs"
                v-on="on"
                link
                :disabled="!hasTemplate || isInSyncWithTemplate"
              >
                <v-list-item-title>
                  <v-icon left :disabled="!hasTemplate || isInSyncWithTemplate">fa-sync</v-icon>
                  {{ $t('scheme-questions.sync.synchronize') }}
                </v-list-item-title>
              </v-list-item>
            </template>
            {{ $t('scheme-questions.sync.confirm') }}
          </confirm-dialog>
        </v-list>
      </v-menu>
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
import { PromptQuestion } from '@common/prompts';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { MoveSection } from './question-list.vue';
import SaveAsTemplateDialog from './save-as-template-dialog.vue';

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
    SaveAsTemplateDialog,
  },

  data() {
    return {
      contextMenu: false,
      moveToSection: null,
    };
  },

  computed: {
    template(): PromptQuestion | undefined {
      return this.templates.find((template) => template.id === this.question.id);
    },

    hasTemplate(): boolean {
      return !!this.template;
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
