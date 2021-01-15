<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded" @save="onSubmit">
    <v-container>
      <v-item-group mandatory active-class="secondary">
        <v-row>
          <v-col v-for="item in sections.survey" :key="item" cols="12" md="4">
            <v-item v-slot:default="{ active, toggle }" @change="swap(item)">
              <v-card :color="active ? 'primary' : ''" dark height="160" @click.stop="toggle">
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
              <v-card :color="active ? 'primary' : ''" dark height="160" @click.stop="toggle">
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
    <question-list :refScheme="refScheme" :section="section" :items.sync="selected"></question-list>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import formMixin from '@/components/entry/formMixin';
import Form from '@/helpers/Form';
import {
  Dictionary,
  PromptQuestion,
  QuestionSection,
  MealSection,
  RecallQuestions,
} from '@common/types';

import { FormMixin } from '@/types/vue';
import QuestionList from './QuestionList.vue';

const defaultQuestions: RecallQuestions = {
  preMeals: [],
  meals: {
    preFoods: [],
    foods: [],
    postFoods: [],
  },
  postMeals: [],
  submission: [],
};

const flattenScheme = (collection: Record<string, PromptQuestion[]>): PromptQuestion[] => {
  return Object.values(collection).reduce((acc, item) => {
    return Array.isArray(item) ? acc.concat(item) : acc.concat(flattenScheme(item));
  }, []);
};

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'SchemeQuestions',

  components: { QuestionList },

  mixins: [formMixin],

  data() {
    return {
      form: new Form({
        id: null,
        name: null,
        type: 'legacy',
        questions: defaultQuestions,
        meals: [],
      }),
      sections: {
        survey: ['preMeals', 'postMeals', 'submission'] as QuestionSection[],
        meal: ['preFoods', 'foods', 'postFoods'] as MealSection[],
      },
      section: 'preMeals' as MealSection & QuestionSection,
    };
  },

  computed: {
    selected: {
      get(): PromptQuestion[] {
        const { section } = this;

        return this.sections.meal.includes(section)
          ? this.form.questions.meals[section]
          : this.form.questions[section];
      },
      set(value: PromptQuestion[]): void {
        const { section } = this;

        if (this.sections.meal.includes(section)) {
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
    /*
     * formMixin override
     */
    toForm(data: Dictionary) {
      const { questions, ...rest } = data;
      this.form.load({ ...rest, questions: { ...defaultQuestions, ...questions } });
    },

    swap(section: QuestionSection & MealSection) {
      this.section = section;
    },
  },
});
</script>

<style lang="scss" scoped></style>
