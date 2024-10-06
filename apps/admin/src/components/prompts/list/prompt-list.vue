<template>
  <v-expansion-panel :value="isOverrideMode ? 'override' : section">
    <v-expansion-panel-title>
      <div class="d-flex flex-row justify-content-space-between">
        <v-avatar class="mr-3" color="primary" size="28">
          <span class="text-white font-weight-medium text-h6">{{ step }}</span>
        </v-avatar>
        <div class="d-flex flex-column">
          <div class="text-h6">
            {{ title }}
          </div>
          <div class="text-subtitle-2">
            {{ subtitle }}
          </div>
        </div>
      </div>
      <template #actions="{ expanded }">
        <div class="d-flex align-center">
          <template v-if="expanded">
            <v-btn
              v-if="!isOverrideMode"
              color="primary"
              icon="$add"
              size="small"
              :title="$t('survey-schemes.prompts.create')"
              @click.stop="create"
            />
            <options-menu>
              <load-prompt-dialog
                :items="isOverrideMode ? templates : undefined"
                :prompt-ids="promptIds"
                :scheme-id="$route.params.id"
                @load="load"
              />
              <json-editor-dialog v-model="prompts" />
            </options-menu>
          </template>
          <v-icon class="ms-2" :icon="expanded ? '$expand' : '$collapse'" />
        </div>
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-list lines="two">
        <vue-draggable
          v-model="prompts"
          :animation="300"
          handle=".drag-and-drop__handle"
        >
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
          />
        </vue-draggable>
      </v-list>
      <prompt-selector ref="selector" v-bind="{ mode, section, promptIds }" @save="save" />
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-divider />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import type { SinglePrompt } from '@intake24/common/prompts';
import type { MealSection, PromptSection, SurveyPromptSection } from '@intake24/common/surveys';
import { OptionsMenu } from '@intake24/admin/components/dialogs';
import { JsonEditorDialog } from '@intake24/admin/components/editors';
import { promptSettings } from '@intake24/admin/components/prompts';
import { copy } from '@intake24/common/util';

import PromptSelector from '../prompt-selector.vue';
import LoadPromptDialog from './load-prompt-dialog.vue';
import PromptListItem from './prompt-list-item.vue';

export type MoveSection = { value: string; title: string };

export type PromptEvent = {
  index: number;
  prompt: SinglePrompt;
};

export interface PromptMoveEvent extends PromptEvent {
  section: MealSection | SurveyPromptSection;
}

export default defineComponent({
  name: 'PromptList',

  components: {
    JsonEditorDialog,
    LoadPromptDialog,
    OptionsMenu,
    PromptListItem,
    PromptSelector,
    VueDraggable,
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
      type: Array as PropType<SinglePrompt[]>,
      default: () => [],
    },
    items: {
      type: Array as PropType<SinglePrompt[]>,
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
          : `survey-schemes.prompts.${this.section}.title`,
      );
    },
    subtitle(): string {
      return this.$t(
        this.isOverrideMode
          ? `survey-schemes.overrides.prompts.subtitle`
          : `survey-schemes.prompts.${this.section}.subtitle`,
      );
    },
  },

  watch: {
    items(val) {
      if (deepEqual(val, this.prompts))
        return;

      this.prompts = [...val];
    },
    prompts(val) {
      if (deepEqual(val, this.items))
        return;

      this.update();
    },
  },

  methods: {
    toggle() {
      this.open = this.open === this.step ? 0 : this.step;
    },

    create() {
      if (this.isOverrideMode)
        return;

      this.selector?.create();
    },

    load(prompt: SinglePrompt) {
      this.prompts.push(prompt);
    },

    copy({ prompt, index }: PromptEvent) {
      this.prompts.splice(index + 1, 0, { ...copy(prompt), name: `${prompt.name} (copy)` });
    },

    edit({ prompt, index }: PromptEvent) {
      this.selector?.edit(index, prompt);
    },

    save({ prompt, index }: PromptEvent) {
      if (index === -1)
        this.prompts.push(prompt);
      else this.prompts.splice(index, 1, prompt);
    },

    moveSections(prompt: SinglePrompt): MoveSection[] {
      return this.promptSettings[prompt.component].sections.filter(item => item !== this.section).map(item => ({
        value: item,
        title: this.$t(`survey-schemes.prompts.${item}.title`),
      }));
    },

    move(event: PromptMoveEvent) {
      if (this.isOverrideMode)
        return;

      this.$emit('move', event);
      this.prompts.splice(event.index, 1);
    },

    remove(index: number) {
      this.prompts.splice(index, 1);
    },

    sync({ prompt, index }: PromptEvent) {
      if (this.isOverrideMode)
        return;

      this.prompts.splice(index, 1, prompt);
    },

    update() {
      this.$emit('update:items', this.prompts);
    },
  },
});
</script>

<style lang="scss">
</style>
