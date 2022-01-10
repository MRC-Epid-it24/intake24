<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-toolbar flat tile color="grey lighten-5" bottom>
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`schemes.data-export.sections._`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <load-section-dialog
        :schemeId="id"
        section="questions"
        @load="loadFromScheme"
      ></load-section-dialog>
    </v-toolbar>
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
    <prompt-list
      v-bind="{ section, questionIds, templates }"
      :items.sync="selected"
      @move="move"
    ></prompt-list>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import {
  defaultExport,
  defaultMeals,
  defaultQuestions,
  flattenScheme,
  isMealSection,
  mealSections,
  surveySections,
  SurveyQuestionSection,
  MealSection,
  RecallQuestions,
} from '@intake24/common/schemes';
import { PromptQuestion } from '@intake24/common/prompts';
import { Dictionary } from '@intake24/common/types';
import { SchemeEntry, SchemeRefs } from '@intake24/common/types/http/admin';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import LoadSectionDialog from '@intake24/admin/components/prompts/load-section-dialog.vue';
import PromptList, {
  PromptQuestionMoveEvent,
} from '@intake24/admin/components/prompts/list/prompt-list.vue';
import { form } from '@intake24/admin/helpers';
import { FormMixin } from '@intake24/admin/types';
import { SchemeForm } from '../form.vue';

export default (Vue as VueConstructor<Vue & FormMixin<SchemeEntry, SchemeRefs>>).extend({
  name: 'SchemeQuestions',

  components: { LoadSectionDialog, PromptList },

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

    loadFromScheme(questions: RecallQuestions) {
      this.form.questions = { ...questions };
    },
  },
});
</script>

<style lang="scss" scoped></style>
