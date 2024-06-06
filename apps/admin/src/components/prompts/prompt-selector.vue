<template>
  <v-dialog
    v-model="dialog.show"
    fullscreen
    hide-overlay
    no-click-animation
    persistent
    :retain-focus="false"
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar color="secondary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="reset">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`survey-schemes.prompts.${dialog.index === -1 ? 'create' : 'edit'}`) }}
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn dark text :title="$t('common.action.ok')" @click.stop="save">
            <v-icon left>
              $success
            </v-icon>{{ $t('common.action.ok') }}
          </v-btn>
        </v-toolbar-items>
        <template #extension>
          <v-container :fluid="$vuetify.breakpoint.mdAndDown">
            <v-tabs v-model="tab" background-color="secondary" dark>
              <v-tab
                v-for="item in promptSettings[dialog.prompt.component].tabs"
                :key="item"
                :tab-value="item"
              >
                {{ item }}
              </v-tab>
            </v-tabs>
          </v-container>
        </template>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="save">
        <v-container class="prompt-container" :fluid="$vuetify.breakpoint.mdAndDown">
          <v-tabs-items v-model="tab" class="pt-1 flex-grow-1">
            <v-tab-item key="general" value="general">
              <v-row>
                <v-col cols="12">
                  <v-card outlined>
                    <v-toolbar color="grey lighten-4" flat>
                      <v-toolbar-title>
                        <v-icon left>
                          fas fa-fingerprint
                        </v-icon>
                        {{ $t('survey-schemes.prompts.internal._') }}
                      </v-toolbar-title>
                    </v-toolbar>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="dialog.prompt.id"
                            :disabled="isOverrideMode"
                            hide-details="auto"
                            :label="$t('survey-schemes.prompts.internal.id._')"
                            :messages="$t('survey-schemes.prompts.internal.id.hint')"
                            outlined
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="dialog.prompt.name"
                            :disabled="isOverrideMode"
                            hide-details="auto"
                            :label="$t('survey-schemes.prompts.internal.name._')"
                            :messages="$t('survey-schemes.prompts.internal.name.hint')"
                            outlined
                          />
                        </v-col>
                        <v-col v-if="dialog.prompt.type === 'custom'" cols="12" md="6">
                          <v-text-field
                            v-model="dialog.prompt.group"
                            :disabled="isOverrideMode"
                            hide-details="auto"
                            :label="$t('survey-schemes.prompts.internal.group._')"
                            :messages="$t('survey-schemes.prompts.internal.group.hint')"
                            outlined
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>
                <v-col v-if="!isOverrideMode" cols="12">
                  <v-card outlined>
                    <v-toolbar color="grey lighten-4" flat>
                      <v-toolbar-title>
                        <v-icon left>
                          fas fa-circle-question
                        </v-icon>
                        {{ $t(`survey-schemes.prompts.type`) }}
                      </v-toolbar-title>
                      <template #extension>
                        <v-tabs v-model="promptTypeTab">
                          <v-tab
                            v-for="type in Object.keys(availableGroupedPrompts)"
                            :key="type"
                            class="font-weight-medium"
                          >
                            {{ $t(`survey-schemes.prompts.${type}._`) }}
                          </v-tab>
                        </v-tabs>
                      </template>
                    </v-toolbar>
                    <v-item-group
                      v-model="dialog.prompt.component"
                      active-class="primary"
                      @change="updatePromptProps"
                    >
                      <v-tabs-items v-model="promptTypeTab">
                        <prompt-type-selector
                          v-for="(items, type) in availableGroupedPrompts"
                          :key="type"
                          v-bind="{ prompts: items, type }"
                        />
                      </v-tabs-items>
                    </v-item-group>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <prompt-content
              :component="dialog.prompt.component"
              :i18n.sync="dialog.prompt.i18n"
            />
            <prompt-actions :actions.sync="dialog.prompt.actions" />
            <prompt-conditions :conditions.sync="dialog.prompt.conditions" />
            <prompt-graph :graph.sync="dialog.prompt.graph" :use-graph.sync="dialog.prompt.useGraph" />
            <prompt-validation
              v-if="
                'validation' in dialog.prompt
                  && promptSettings[dialog.prompt.component].tabs.includes('validation')
              "
              :limits="dialog.prompt.component === 'checkbox-list-prompt'"
              :validation.sync="dialog.prompt.validation"
            />
            <component
              :is="dialog.prompt.component"
              v-bind.sync="dialog.prompt"
              @validate="validate"
            />
            <prompt-json v-model="dialog.prompt" />
          </v-tabs-items>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
              <v-icon left>
                $cancel
              </v-icon>{{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer />
            <v-btn class="font-weight-bold" color="info" text type="submit">
              <v-icon left>
                $success
              </v-icon>{{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { Prompt, PromptType } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import {
  customPrompts,
  portionSizePrompts,
  promptSettings,
  standardPrompts,
} from '@intake24/admin/components/prompts';
import PromptGraph from '@intake24/admin/components/prompts/partials/prompt-graph.vue';
import {
  customPrompts as customPromptDefaults,
  portionSizePrompts as portionSizeDefaults,
  standardPrompts as standardPromptDefaults,
} from '@intake24/common/prompts';
import { copy, merge } from '@intake24/common/util';

import { useTinymce } from '../editors';
import {
  PromptActions,
  PromptConditions,
  PromptContent,
  PromptJson,
  PromptValidation,
} from './partials';
import PromptTypeSelector from './prompt-type-selector.vue';

export type EditPrompt = Prompt & {
  origId?: string;
};

export type PromptDialog = {
  show: boolean;
  index: number;
  prompt: EditPrompt;
};

export default defineComponent({
  name: 'PromptSelector',

  components: {
    PromptGraph,
    PromptActions,
    PromptConditions,
    PromptContent,
    PromptJson,
    PromptTypeSelector,
    PromptValidation,
    ...customPrompts,
    ...standardPrompts,
    ...portionSizePrompts,
  },

  props: {
    mode: {
      type: String as PropType<'full' | 'override'>,
      default: 'full',
    },
    section: {
      type: String as PropType<PromptSection>,
    },
    promptIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },

  emits: ['save'],

  setup() {
    useTinymce();
    const form = ref<InstanceType<typeof HTMLFormElement>>();

    return { form };
  },

  data() {
    const prompts = [...customPromptDefaults, ...standardPromptDefaults, ...portionSizeDefaults];

    const groupedPrompts: Record<PromptType, Prompt[]> = {
      custom: customPromptDefaults,
      standard: standardPromptDefaults,
      'portion-size': portionSizeDefaults,
    };

    const dialog: PromptDialog = {
      show: false,
      index: -1,
      prompt: copy(prompts[0]),
    };

    return {
      dialog,
      prompts,
      groupedPrompts,
      promptSettings,
      tab: 0,
      promptTypeTab: 0,
    };
  },

  computed: {
    isOverrideMode(): boolean {
      return this.mode === 'override';
    },
    availablePrompts(): Prompt[] {
      const { section } = this;
      if (!section)
        return this.prompts;

      return this.prompts.filter(prompt =>
        this.promptSettings[prompt.component].sections.includes(section),
      );
    },
    availableGroupedPrompts(): Record<PromptType, Prompt[]> {
      const { section } = this;
      if (!section)
        return this.groupedPrompts;

      return Object.entries(this.groupedPrompts).reduce(
        (acc, [key, value]) => {
          acc[key as PromptType] = value.filter(prompt =>
            this.promptSettings[prompt.component].sections.includes(section),
          );
          return acc;
        },
        {} as Record<PromptType, Prompt[]>,
      );
    },
  },

  methods: {
    newDialog(show = false): PromptDialog {
      return {
        show,
        index: -1,
        prompt: copy(this.availablePrompts[0]),
      };
    },

    updatePromptProps() {
      const { show, index, prompt } = this.dialog;
      const { component } = prompt;

      const newPrompt
        = this.availablePrompts.find(item => item.component === component)
        ?? this.availablePrompts[0];
      if (!newPrompt)
        return;

      this.dialog = {
        show,
        index,
        prompt: copy(newPrompt),
      };
    },

    updatePromptTypeTab(type: Prompt['type']) {
      switch (type) {
        case 'standard':
          this.promptTypeTab = 1;
          break;
        case 'portion-size':
          this.promptTypeTab = 2;
          break;
        default:
          this.promptTypeTab = 0;
      }
    },

    create() {
      this.dialog = this.newDialog(true);
      this.updatePromptTypeTab(this.dialog.prompt.type);
    },

    edit(index: number, prompt: Prompt) {
      const promptDefaults = this.prompts.find(p => p.component === prompt.component);
      if (!promptDefaults) {
        console.warn(`Prompt defaults for prompt type '${prompt.component}' not found.`);
        return;
      }

      this.updatePromptTypeTab(prompt.type);

      this.dialog = {
        show: true,
        index,
        prompt: { origId: prompt.id, ...merge<Prompt>(promptDefaults, prompt) },
      };
    },

    save() {
      const isValid = this.form?.validate();
      if (!isValid)
        return;

      const {
        index,
        prompt: { origId, i18n, ...rest },
      } = this.dialog;

      for (const [key, value] of Object.entries(i18n)) {
        if (!Object.keys(value).length)
          delete i18n[key];
      }

      this.$emit('save', { prompt: { i18n, ...rest }, index });

      this.reset();
    },

    reset() {
      this.tab = 0;
      this.promptTypeTab = 0;
      this.dialog = this.newDialog();
      this.form?.resetValidation();
    },

    validate() {
      this.form?.validate();
    },
  },
});
</script>

<style lang="scss" scoped>
.prompt-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 112px);
}
</style>
