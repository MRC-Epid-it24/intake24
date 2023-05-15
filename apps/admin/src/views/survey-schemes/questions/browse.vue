<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-toolbar color="grey lighten-5" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`survey-schemes.questions.title`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <options-menu>
        <select-resource resource="survey-schemes" return-object="questions" @input="load">
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" link v-on="on">
              <v-list-item-title>
                <v-icon left>fas fa-download</v-icon>
                {{ $t('survey-schemes.load') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </select-resource>
        <json-editor v-model="form.questions"></json-editor>
      </options-menu>
    </v-toolbar>
    <prompt-list
      v-for="(section, index) in promptSections"
      :key="section"
      v-bind="{
        section,
        step: index + 1,
        questionIds,
        templates,
        items: isMealSection(section) ? form.questions.meals[section] : form.questions[section],
      }"
      @move="move"
      @update:items="updateItems(section, $event)"
    ></prompt-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PromptQuestionMoveEvent } from '@intake24/admin/components/prompts/list/prompt-list.vue';
import type { Prompt } from '@intake24/common/prompts';
import type { PromptSection, RecallQuestions } from '@intake24/common/surveys';
import type { SurveySchemeEntry, SurveySchemeRefs } from '@intake24/common/types/http/admin';
import { OptionsMenu, SelectResource } from '@intake24/admin/components/dialogs';
import { JsonEditor } from '@intake24/admin/components/editors';
import { formMixin } from '@intake24/admin/components/entry';
import { promptSections } from '@intake24/admin/components/prompts';
import PromptList from '@intake24/admin/components/prompts/list/prompt-list.vue';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { defaultQuestions, flattenScheme, isMealSection } from '@intake24/common/surveys';

import type { SurveySchemeForm } from '../form.vue';

export type SurveySchemeQuestionsForm = Pick<SurveySchemeForm, 'questions'>;

export default defineComponent({
  name: 'SurveySchemeQuestions',

  components: { JsonEditor, OptionsMenu, PromptList, SelectResource },

  mixins: [formMixin],

  setup(props) {
    const loadCallback = (data: SurveySchemeEntry) => {
      const { questions, ...rest } = data;
      return { ...rest, questions: { ...defaultQuestions, ...questions } };
    };

    const { entry, entryLoaded, refs, refsLoaded } = useEntry<SurveySchemeEntry, SurveySchemeRefs>(
      props
    );
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      SurveySchemeQuestionsForm,
      SurveySchemeEntry
    >(props, {
      data: { questions: defaultQuestions },
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
    questionIds(): string[] {
      return flattenScheme(this.form.questions).map((question) => question.id);
    },
    templates(): Prompt[] {
      if (!this.refsLoaded) return [];

      return this.refs.templates.filter((template) => this.questionIds.includes(template.id));
    },
  },

  methods: {
    isMealSection,

    load(questions: RecallQuestions) {
      this.form.questions = { ...questions };
    },

    move(event: PromptQuestionMoveEvent) {
      const { section, question } = event;

      if (isMealSection(section)) {
        this.form.questions.meals[section].push(question);
        return;
      }

      this.form.questions[section].push(question);
    },

    updateItems(section: PromptSection, prompts: Prompt[]) {
      if (isMealSection(section)) {
        this.form.questions.meals[section] = prompts;
        return;
      }

      this.form.questions[section] = prompts;
    },
  },
});
</script>

<style lang="scss" scoped></style>
