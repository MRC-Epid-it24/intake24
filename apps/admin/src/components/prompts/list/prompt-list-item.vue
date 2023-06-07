<template>
  <v-list-item class="drag-and-drop__item" draggable link>
    <v-list-item-avatar class="drag-and-drop__handle">
      <v-icon>$handle</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ question.name }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ `ID: ${question.id} | Type: ${question.component}` }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-content v-if="!isOverrideMode && hasTemplate">
      <v-list-item-subtitle>
        <v-icon :color="isInSyncWithTemplate ? `success` : `warning`" left>fas fa-sync</v-icon>
        <span color="success">
          {{ $t(`survey-scheme-questions.sync.${isInSyncWithTemplate ? 'true' : 'false'}`) }}
        </span>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon :title="$t('survey-schemes.questions.edit')" @click.stop="edit">
        <v-icon color="primary lighten-1">$edit</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action v-if="!isOverrideMode">
      <v-menu
        v-model="contextMenu"
        close-on-click
        close-on-content-click
        max-width="600px"
        offset-y
      >
        <template #activator="{ attrs, on }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon color="primary lighten-1">$options</v-icon>
          </v-btn>
        </template>
        <v-list>
          <confirm-dialog
            color="primary lighten-1"
            :label="$t('survey-schemes.questions.move').toString()"
            max-width="450px"
            @close="clearMoveToSection"
            @confirm="move"
          >
            <template #activator="{ attrs, on }">
              <v-list-item link v-bind="attrs" v-on="on">
                <v-list-item-title>
                  <v-icon left>fas fa-exchange-alt</v-icon>
                  {{ $t('survey-schemes.questions.move') }}
                </v-list-item-title>
              </v-list-item>
            </template>
            <v-select
              v-model="moveToSection"
              hide-details="auto"
              :items="moveSections"
              :label="$t('survey-schemes.questions.section')"
              outlined
            ></v-select>
          </confirm-dialog>
          <save-as-template-dialog
            v-if="can('survey-schemes-questions|create')"
            :disabled="hasTemplate"
            :question="question"
          ></save-as-template-dialog>
          <confirm-dialog
            color="primary lighten-1"
            :label="$t('survey-scheme-questions.sync.synchronize').toString()"
            max-width="450px"
            @confirm="sync"
          >
            <template #activator="{ attrs, on }">
              <v-list-item
                v-bind="attrs"
                :disabled="!hasTemplate || isInSyncWithTemplate"
                link
                v-on="on"
              >
                <v-list-item-title>
                  <v-icon :disabled="!hasTemplate || isInSyncWithTemplate" left>fas fa-sync</v-icon>
                  {{ $t('survey-scheme-questions.sync.synchronize') }}
                </v-list-item-title>
              </v-list-item>
            </template>
            {{ $t('survey-scheme-questions.sync.confirm') }}
          </confirm-dialog>
        </v-list>
      </v-menu>
    </v-list-item-action>
    <v-list-item-action>
      <confirm-dialog
        color="error"
        icon
        icon-left="$delete"
        :label="$t('survey-schemes.questions.remove').toString()"
        @confirm="remove"
      >
        {{ $t('common.action.confirm.delete', { name: question.name }) }}
      </confirm-dialog>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import { copy } from '@intake24/common/util';
import { ConfirmDialog } from '@intake24/ui';

import type { MoveSection } from './prompt-list.vue';
import SaveAsTemplateDialog from './save-as-template-dialog.vue';

export default defineComponent({
  name: 'QuestionListItem',

  components: {
    ConfirmDialog,
    SaveAsTemplateDialog,
  },

  props: {
    mode: {
      type: String as PropType<'full' | 'override'>,
      default: 'full',
    },
    question: {
      type: Object as PropType<Prompt>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    moveSections: {
      type: Array as PropType<MoveSection[]>,
      default: () => [],
    },
    templates: {
      type: Array as PropType<Prompt[]>,
      default: () => [],
    },
  },

  emits: ['question:edit', 'question:move', 'question:remove', 'question:sync'],

  data() {
    return {
      contextMenu: false,
      moveToSection: null,
    };
  },

  computed: {
    isOverrideMode(): boolean {
      return this.mode === 'override';
    },

    template(): Prompt | undefined {
      return this.templates.find((template) => template.id === this.question.id);
    },

    hasTemplate(): boolean {
      return !!this.template;
    },

    isInSyncWithTemplate(): boolean {
      return !!this.template && deepEqual(this.question, this.template);
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
        question: copy(this.question),
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
        question: copy(this.template),
        index: this.index,
      });
    },
  },
});
</script>
