<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container>
      <v-item-group v-model="section" mandatory active-class="secondary">
        <v-row>
          <v-col v-for="item in sections.survey" :key="item" cols="12" md="4">
            <v-item v-slot:default="{ active, toggle }" :value="item">
              <v-card :color="active ? 'primary' : ''" dark height="180" @click.stop="toggle">
                <v-card-title class="justify-center">
                  {{ $t(`schemes.questions.${item}.title`) }}
                </v-card-title>
                <v-card-subtitle class="text-center">
                  {{ $t(`schemes.questions.${item}.subtitle`) }}
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
            <v-item v-slot:default="{ active, toggle }" :value="item">
              <v-card :color="active ? 'primary' : ''" dark height="180" @click.stop="toggle">
                <v-card-title class="justify-center">
                  {{ $t(`schemes.questions.${item}.title`) }}
                </v-card-title>
                <v-card-subtitle class="text-center">
                  {{ $t(`schemes.questions.${item}.subtitle`) }}
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
    <question-list
      v-bind="{ section, questionIds }"
      :templates="refs.templates"
      :items.sync="selected"
      @move="move"
    ></question-list>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import formMixin from '@/components/entry/formMixin';
import form from '@/helpers/Form';
import { FormMixin } from '@/types/vue';
import {
  defaultExport,
  defaultMeals,
  defaultQuestions,
  flattenScheme,
  isMealSection,
  mealSections,
  surveySections,
} from '@common/schemes';
import { PromptQuestion } from '@common/prompts';
import { Dictionary, SurveyQuestionSection, MealSection } from '@common/types';
import { SchemeForm } from './Form.vue';
import QuestionList, { PromptQuestionMoveEvent } from './QuestionList.vue';

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'SchemeQuestions',

  components: { QuestionList },

  mixins: [formMixin],

  data() {
    return {
      form: form<SchemeForm>({
        id: null,
        name: null,
        type: 'data-driven',
        questions: defaultQuestions,
        meals: defaultMeals,
        export: defaultExport,
      }),
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
  },

  methods: {
    /*
     * formMixin override
     */
    toForm(data: Dictionary) {
      const { questions, ...rest } = data;
      this.form.load({ ...rest, questions: { ...defaultQuestions, ...questions } });
    },

    move(event: PromptQuestionMoveEvent) {
      const { section, question } = event;

      if (isMealSection(section)) {
        this.form.questions.meals[section].push(question);
        return;
      }

      this.form.questions[section].push(question);
    },
  },
});
</script>

<style lang="scss" scoped></style>
