<template>
  <v-stepper v-model="open" class="pb-6" flat non-linear tile vertical>
    <v-stepper-step v-bind="{ step }" class="py-2 pointer" @click.stop="toggle">
      <v-toolbar flat tile>
        <v-toolbar-title class="font-weight-medium">
          {{ title }}
          <div class="text-subtitle-2">{{ subtitle }}</div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-if="isOpened">
          <v-btn
            v-if="!isOverrideMode"
            color="secondary"
            fab
            small
            :title="$t('survey-schemes.prompts.create')"
            @click.stop="create"
          >
            <v-icon small>$add</v-icon>
          </v-btn>
          <options-menu>
            <load-prompt-dialog
              :items="isOverrideMode ? templates : undefined"
              :prompt-ids="promptIds"
              :scheme-id="$route.params.id"
              @load="load"
            ></load-prompt-dialog>
            <json-editor-dialog v-model="prompts"></json-editor-dialog>
          </options-menu>
        </template>
        <v-icon :class="{ 'fa-rotate-180': isOpened, 'ml-4': isOpened }">$expand</v-icon>
      </v-toolbar>
    </v-stepper-step>
    <v-stepper-content v-bind="{ step }">
      <v-list two-line>
        <draggable v-model="prompts" handle=".drag-and-drop__handle">
          <transition-group name="drag-and-drop" type="transition">
            <prompt-list-item
              v-for="(prompt, index) in prompts"
              :key="`${prompt.id}:${prompt.name}`"
              v-bind="{ mode, prompt, index, templates }"
              :move-sections="moveSections(prompt)"
              @prompt:copy="copy"
              @prompt:edit="edit"
              @prompt:move="move"
              @prompt:remove="remove"
              @prompt:sync="sync"
            >
            </prompt-list-item>
          </transition-group>
        </draggable>
      </v-list>
    </v-stepper-content>
    <prompt-selector ref="selector" v-bind="{ mode, section, promptIds }" @save="save">
    </prompt-selector>
  </v-stepper>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';

import type { Prompt } from '@intake24/common/prompts';
import type { MealSection, PromptSection, SurveyPromptSection } from '@intake24/common/surveys';
import { OptionsMenu } from '@intake24/admin/components/dialogs';
import { JsonEditorDialog } from '@intake24/admin/components/editors';
import { promptSettings } from '@intake24/admin/components/prompts';
import { copy } from '@intake24/common/util';

import PromptSelector from '../prompt-selector.vue';
import LoadPromptDialog from './load-prompt-dialog.vue';
import PromptListItem from './prompt-list-item.vue';

export type MoveSection = { value: string; text: string };

export type PromptEvent = {
  index: number;
  prompt: Prompt;
};

export interface PromptMoveEvent extends PromptEvent {
  section: MealSection | SurveyPromptSection;
}

export default defineComponent({
  name: 'PromptList',

  components: {
    draggable,
    JsonEditorDialog,
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
      type: String as PropType<PromptSection>,
    },
    step: {
      type: Number,
      default: 1,
    },
    promptIds: {
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
      prompts: this.items,
      promptSettings,
      open: this.step,
    };
  },

  computed: {
    isOverrideMode(): boolean {
      return this.mode === 'override';
    },
    isOpened(): boolean {
      return this.open === this.step;
    },
    title(): string {
      return this.$t(
        this.isOverrideMode
          ? `survey-schemes.overrides.prompts.title`
          : `survey-schemes.prompts.${this.section}.title`
      ).toString();
    },
    subtitle(): string {
      return this.$t(
        this.isOverrideMode
          ? `survey-schemes.overrides.prompts.subtitle`
          : `survey-schemes.prompts.${this.section}.subtitle`
      ).toString();
    },
  },

  watch: {
    items(val) {
      if (deepEqual(val, this.prompts)) return;

      this.prompts = [...val];
    },
    prompts(val) {
      if (deepEqual(val, this.items)) return;

      this.update();
    },
  },

  methods: {
    toggle() {
      this.open = this.open === this.step ? 0 : this.step;
    },

    create() {
      if (this.isOverrideMode) return;

      this.selector?.create();
    },

    load(prompt: Prompt) {
      this.prompts.push(prompt);
    },

    copy({ prompt, index }: PromptEvent) {
      this.prompts.splice(index + 1, 0, { ...copy(prompt), name: `${prompt.name} (copy)` });
    },

    edit({ prompt, index }: PromptEvent) {
      this.selector?.edit(index, prompt);
    },

    save({ prompt, index }: PromptEvent) {
      if (index === -1) this.prompts.push(prompt);
      else this.prompts.splice(index, 1, prompt);
    },

    moveSections(prompt: Prompt): MoveSection[] {
      return this.promptSettings[prompt.component].sections
        .filter((item) => item !== this.section)
        .map((item) => ({
          value: item,
          text: this.$t(`survey-schemes.prompts.${item}.title`).toString(),
        }));
    },

    move(event: PromptMoveEvent) {
      if (this.isOverrideMode) return;

      this.$emit('move', event);
      this.prompts.splice(event.index, 1);
    },

    remove(index: number) {
      this.prompts.splice(index, 1);
    },

    sync({ prompt, index }: PromptEvent) {
      if (this.isOverrideMode) return;

      this.prompts.splice(index, 1, prompt);
    },

    update() {
      this.$emit('update:items', this.prompts);
    },
  },
});
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
