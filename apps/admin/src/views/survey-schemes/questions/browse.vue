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
    <v-container>
      <v-item-group v-model="section" active-class="secondary" mandatory>
        <v-row>
          <v-col v-for="item in sections.survey" :key="item" cols="12" md="4">
            <v-item v-slot="{ active, toggle }" :value="item">
              <v-card :color="active ? 'primary' : ''" dark height="180" @click.stop="toggle">
                <v-card-title class="justify-center">
                  {{ $t(`survey-schemes.questions.${item}.title`) }}
                </v-card-title>
                <v-card-subtitle class="text-center">
                  {{ $t(`survey-schemes.questions.${item}.subtitle`) }}
                </v-card-subtitle>
                <v-card-text v-show="active" class="text-center">
                  <v-icon x-large>fa-check-circle</v-icon>
                </v-card-text>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
        <v-divider class="my-3"></v-divider>
        <v-row>
          <v-col v-for="item in sections.meal" :key="item" cols="12" md="4">
            <v-item v-slot="{ active, toggle }" :value="item">
              <v-card :color="active ? 'primary' : ''" dark height="180" @click.stop="toggle">
                <v-card-title class="justify-center">
                  {{ $t(`survey-schemes.questions.${item}.title`) }}
                </v-card-title>
                <v-card-subtitle class="text-center">
                  {{ $t(`survey-schemes.questions.${item}.subtitle`) }}
                </v-card-subtitle>
                <v-card-text v-show="active" class="text-center">
                  <v-icon x-large>fa-check-circle</v-icon>
                </v-card-text>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </v-container>
    <prompt-list
      v-bind="{ section, questionIds, templates }"
      :items.sync="selected"
      @move="move"
    ></prompt-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { PromptQuestionMoveEvent } from '@intake24/admin/components/prompts/list/prompt-list.vue';
import type { Prompt } from '@intake24/common/prompts';
import type { MealSection, RecallQuestions, SurveyQuestionSection } from '@intake24/common/surveys';
import type { SurveySchemeEntry, SurveySchemeRefs } from '@intake24/common/types/http/admin';
import { OptionsMenu, SelectResource } from '@intake24/admin/components/dialogs';
import { JsonEditor } from '@intake24/admin/components/editors';
import { formMixin } from '@intake24/admin/components/entry';
import PromptList from '@intake24/admin/components/prompts/list/prompt-list.vue';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import {
  defaultQuestions,
  flattenScheme,
  isMealSection,
  mealSections,
  surveySections,
} from '@intake24/common/surveys';

import type { SurveySchemeForm } from '../form.vue';

export type SurveySchemeQuestionsForm = Pick<SurveySchemeForm, 'questions'>;

export default defineComponent({
  name: 'SurveySchemeQuestions',

  components: { JsonEditor, OptionsMenu, PromptList, SelectResource },

  mixins: [formMixin],

  setup(props) {
    const sections = ref({
      survey: surveySections,
      meal: mealSections,
    });
    const section = ref<MealSection | SurveyQuestionSection>('preMeals');

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
      loadCallback,
    });

    return {
      section,
      sections,
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
    selected: {
      get(): Prompt[] {
        const { section } = this;

        return isMealSection(section)
          ? this.form.questions.meals[section]
          : this.form.questions[section];
      },
      set(value: Prompt[]): void {
        const { section } = this;

        if (isMealSection(section)) {
          this.form.questions.meals[section] = value;
          return;
        }

        this.form.questions[section] = value;
      },
    },
    questionIds(): string[] {
      const scheme = flattenScheme(this.form.questions);

      return scheme.map((question) => question.id);
    },
    templates(): Prompt[] {
      if (!this.refsLoaded) return [];

      return this.refs.templates.filter((template) => this.questionIds.includes(template.id));
    },
  },

  methods: {
    move(event: PromptQuestionMoveEvent) {
      const { section, question } = event;

      if (isMealSection(section)) {
        this.form.questions.meals[section].push(question);
        return;
      }

      this.form.questions[section].push(question);
    },

    load(questions: RecallQuestions) {
      this.form.questions = { ...questions };
    },
  },
});
</script>

<style lang="scss" scoped></style>
