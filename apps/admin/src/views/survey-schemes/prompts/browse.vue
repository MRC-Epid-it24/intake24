<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-toolbar color="grey lighten-5" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`survey-schemes.prompts.title`) }}
      </v-toolbar-title>
      <v-spacer />
      <options-menu>
        <select-resource resource="survey-schemes" return-object="prompts" @input="load">
          <template #activator="{ attrs, on }">
            <v-list-item v-bind="attrs" link v-on="on">
              <v-list-item-title>
                <v-icon left>
                  $download
                </v-icon>
                {{ $t('survey-schemes.load') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </select-resource>
        <json-editor-dialog v-model="form.prompts" />
      </options-menu>
    </v-toolbar>
    <prompt-list
      v-for="(section, index) in promptSections"
      :key="section"
      v-bind="{
        section,
        step: index + 1,
        promptIds,
        templates,
        items: isMealSection(section) ? form.prompts.meals[section] : form.prompts[section],
      }"
      @move="move"
      @update:items="updateItems(section, $event)"
    />
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PromptMoveEvent } from '@intake24/admin/components/prompts/list/prompt-list.vue';
import type { Prompt } from '@intake24/common/prompts';
import type { PromptSection, RecallPrompts } from '@intake24/common/surveys';
import type { SurveySchemeEntry, SurveySchemeRefs } from '@intake24/common/types/http/admin';
import { OptionsMenu, SelectResource } from '@intake24/admin/components/dialogs';
import { JsonEditorDialog } from '@intake24/admin/components/editors';
import { formMixin } from '@intake24/admin/components/entry';
import { promptSections } from '@intake24/admin/components/prompts';
import PromptList from '@intake24/admin/components/prompts/list/prompt-list.vue';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { defaultPrompts, flattenScheme, isMealSection } from '@intake24/common/surveys';

import type { SurveySchemeForm } from '../form.vue';

export type SurveySchemePromptsForm = Pick<SurveySchemeForm, 'prompts'>;

export default defineComponent({
  name: 'SurveySchemePrompts',

  components: { JsonEditorDialog, OptionsMenu, PromptList, SelectResource },

  mixins: [formMixin],

  setup(props) {
    const loadCallback = (data: SurveySchemeEntry) => {
      const { prompts, ...rest } = data;
      return { ...rest, prompts: { ...defaultPrompts, ...prompts } };
    };

    const { entry, entryLoaded, refs, refsLoaded } = useEntry<SurveySchemeEntry, SurveySchemeRefs>(
      props,
    );
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      SurveySchemePromptsForm,
      SurveySchemeEntry
    >(props, {
      data: { prompts: defaultPrompts },
      editMethod: 'patch',
      loadCallback,
    });

    return {
      promptSections,
      entry,
      entryLoaded,
      refs,
      refsLoaded,
      clearError,
      form,
      routeLeave,
      submit,
    };
  },

  computed: {
    promptIds(): string[] {
      return flattenScheme(this.form.prompts).map(({ id }) => id);
    },
    templates(): Prompt[] {
      if (!this.refsLoaded)
        return [];

      return this.refs.templates.filter(template => this.promptIds.includes(template.id));
    },
  },

  methods: {
    isMealSection,

    load(prompts: RecallPrompts) {
      this.form.prompts = { ...prompts };
    },

    move(event: PromptMoveEvent) {
      const { section, prompt } = event;

      if (isMealSection(section)) {
        this.form.prompts.meals[section].push(prompt);
        return;
      }

      this.form.prompts[section].push(prompt);
    },

    updateItems(section: PromptSection, prompts: Prompt[]) {
      if (isMealSection(section)) {
        this.form.prompts.meals[section] = prompts;
        return;
      }

      this.form.prompts[section] = prompts;
    },
  },
});
</script>

<style lang="scss" scoped></style>
