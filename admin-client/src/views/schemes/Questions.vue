<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded" @save="onSubmit">
    <v-container>
      <v-item-group mandatory active-class="secondary">
        <v-row>
          <v-col v-for="item in sections.survey" :key="item" cols="12" md="4">
            <v-item v-slot:default="{ active, toggle }" @change="swap(item)">
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
            <v-item v-slot:default="{ active, toggle }" @change="swap(item)">
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
      :refScheme="refScheme"
      :section="section"
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
import { defaultExport, defaultMeals, defaultQuestions } from '@common/defaults';
import {
  Dictionary,
  PromptQuestion,
  QuestionSection,
  MealSection,
  RecallQuestions,
} from '@common/types';
import { SchemeForm } from './Form.vue';
import QuestionList from './QuestionList.vue';

const flattenScheme = (questions: RecallQuestions): PromptQuestion[] =>
  Object.values(questions).reduce((acc, item) => {
    acc.push(...(Array.isArray(item) ? item : flattenScheme(item)));
    return acc;
  }, []);

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
        survey: ['preMeals', 'postMeals', 'submission'] as QuestionSection[],
        meal: ['preFoods', 'foods', 'postFoods'] as MealSection[],
      },
      section: 'preMeals' as MealSection | QuestionSection,
    };
  },

  computed: {
    selected: {
      get(): PromptQuestion[] {
        const { section } = this;

        return this.isMealSection(section)
          ? this.form.questions.meals[section]
          : this.form.questions[section];
      },
      set(value: PromptQuestion[]): void {
        const { section } = this;

        if (this.isMealSection(section)) {
          this.form.questions.meals[section] = value;
          return;
        }

        this.form.questions[section] = value;
      },
    },
    refScheme(): PromptQuestion[] {
      return flattenScheme(this.form.questions);
    },
  },

  methods: {
    isMealSection(section: any): section is MealSection {
      return this.sections.meal.includes(section);
    },

    /*
     * formMixin override
     */
    toForm(data: Dictionary) {
      const { questions, ...rest } = data;
      this.form.load({ ...rest, questions: { ...defaultQuestions, ...questions } });
    },

    swap(section: QuestionSection | MealSection) {
      this.section = section;
    },

    move(event: { section: MealSection | QuestionSection; question: PromptQuestion }) {
      const { section, question } = event;

      if (this.isMealSection(section)) {
        this.form.questions.meals[section].push(question);
        return;
      }

      this.form.questions[section].push(question);
    },
  },
});
</script>

<style lang="scss" scoped></style>
