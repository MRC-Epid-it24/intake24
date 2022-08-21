<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-toolbar flat tile color="grey lighten-5">
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`survey-schemes.questions.title`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <select-resource resource="survey-schemes" return-object="questions" @input="load">
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            class="ml-3"
            color="secondary"
            fab
            small
            :title="$t(`survey-schemes.load`)"
            v-on="on"
          >
            <v-icon>fa-download</v-icon>
          </v-btn>
        </template>
      </select-resource>
    </v-toolbar>
    <v-container>
      <v-item-group v-model="section" mandatory active-class="secondary">
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
import { defineComponent } from 'vue';

import type { PromptQuestionMoveEvent } from '@intake24/admin/components/prompts/list/prompt-list.vue';
import type { PromptQuestion } from '@intake24/common/prompts';
import type { MealSection, RecallQuestions, SurveyQuestionSection } from '@intake24/common/schemes';
import type { Dictionary } from '@intake24/common/types';
import type { SurveySchemeEntry, SurveySchemeRefs } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { SelectResource } from '@intake24/admin/components/forms';
import PromptList from '@intake24/admin/components/prompts/list/prompt-list.vue';
import { form } from '@intake24/admin/helpers';
import {
  defaultQuestions,
  flattenScheme,
  isMealSection,
  mealSections,
  surveySections,
} from '@intake24/common/schemes';

import type { SurveySchemeForm } from '../form.vue';

export type SurveySchemeQuestionsForm = Pick<SurveySchemeForm, 'questions'>;

export default defineComponent({
  name: 'SurveySchemeQuestions',

  components: { PromptList, SelectResource },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<
      SurveySchemeEntry,
      SurveySchemeRefs
    >(props.id);

    return { entry, entryLoaded, refs, refsLoaded };
  },

  data() {
    return {
      editMethod: 'patch',
      form: form<SurveySchemeQuestionsForm>({ questions: defaultQuestions }),
      sections: {
        survey: surveySections,
        meal: mealSections,
      },
      section: 'preMeals' as MealSection | SurveyQuestionSection,
    };
  },

  computed: {
    selected: {
      get(): PromptQuestion[] {
        const { section } = this;

        return isMealSection(section)
          ? this.form.questions.meals[section]
          : this.form.questions[section];
      },
      set(value: PromptQuestion[]): void {
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
    templates(): PromptQuestion[] {
      if (!this.refsLoaded) return [];

      return this.refs.templates.filter((template) => this.questionIds.includes(template.id));
    },
  },

  methods: {
    /*
     * formMixin override
     */
    toForm(data: Dictionary) {
      const { questions, ...rest } = data;
      const input = { ...rest, questions: { ...defaultQuestions, ...questions } };

      this.setOriginalEntry(input);
      this.form.load(input);
    },

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
