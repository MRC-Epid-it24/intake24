<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.prompt.id"
                disabled
                hide-details="auto"
                :label="$t('survey-schemes.prompts.internal.id._')"
                :messages="$t('survey-schemes.prompts.internal.id.hint')"
                name="id"
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.prompt.name"
                disabled
                hide-details="auto"
                :label="$t('survey-schemes.prompts.internal.name._')"
                :messages="$t('survey-schemes.prompts.internal.name.hint')"
                name="name"
                outlined
              />
            </v-col>
            <v-col align="center">
              <v-btn class="pa-6" color="secondary" outlined x-large @click="edit">
                <v-icon left>
                  $edit
                </v-icon>{{ $t('survey-scheme-prompts.editTemplate') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <error-list :errors="nonInputErrors" tag="v-card-text" />
        <v-card-text>
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
      <prompt-selector ref="selector" :prompt-ids="promptIds" @save="save" />
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type {
  SurveySchemePromptEntry,
  SurveySchemePromptRefs,
} from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import PromptSelector from '@intake24/admin/components/prompts/prompt-selector.vue';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { infoPrompt } from '@intake24/common/prompts';

export type SchemePromptForm = {
  id: string | null;
  name: string | null;
  promptId: string | null;
  prompt: Prompt;
};

export default defineComponent({
  name: 'SchemePromptForm',

  components: { PromptSelector },

  mixins: [formMixin],

  setup(props) {
    const { actions, ...prompt } = infoPrompt;

    const { entry, entryLoaded, refs, refsLoaded } = useEntry<
      SurveySchemePromptEntry,
      SurveySchemePromptRefs
    >(props);
    useEntryFetch(props);
    const { clearError, form, nonInputErrors, routeLeave, submit } = useEntryForm<
      SchemePromptForm,
      SurveySchemePromptEntry
    >(props, {
      data: {
        id: null,
        name: null,
        promptId: null,
        prompt,
      },
      nonInputErrorKeys: ['prompt'],
    });

    const selector = ref<InstanceType<typeof PromptSelector>>();

    return {
      entry,
      entryLoaded,
      refs,
      refsLoaded,
      selector,
      clearError,
      form,
      nonInputErrors,
      routeLeave,
      submit,
    };
  },

  computed: {
    promptIds(): string[] {
      return this.refs.promptIds;
    },
  },

  methods: {
    edit() {
      this.selector?.edit(0, this.form.prompt);
    },

    save({ prompt }: { prompt: Prompt; index: number }) {
      this.form.errors.clear('prompt');

      this.form.prompt = prompt;
    },
  },
});
</script>

<style lang="scss" scoped></style>
