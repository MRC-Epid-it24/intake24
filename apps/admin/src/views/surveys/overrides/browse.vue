<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-card-title>{{ $t('survey-schemes.overrides.questions.title') }}</v-card-title>
    <v-card-subtitle>
      Override specific scheme question prompt. Changes will get merged by Question ID.
    </v-card-subtitle>
    <prompt-list
      v-bind="{ mode: 'override', questionIds, templates: questions }"
      :items.sync="form.overrides.questions"
    ></prompt-list>
    <v-card-title>{{ $t('survey-schemes.overrides.meals.title') }}</v-card-title>
    <v-card-subtitle>
      Override scheme meal list. If left empty, scheme list is used. If any item added, whole list
      is used.
    </v-card-subtitle>
    <meal-list
      :schemeId="entry.surveySchemeId"
      v-model="form.overrides.meals"
      mode="override"
    ></meal-list>
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { defaultOverrides, flattenScheme } from '@intake24/common/schemes';
import { SurveyEntry, SurveyRefs } from '@intake24/common/types/http/admin';
import { PromptQuestion } from '@intake24/common/prompts';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import MealList from '@intake24/admin/components/meals/meal-list.vue';
import PromptList from '@intake24/admin/components/prompts/list/prompt-list.vue';
import { form } from '@intake24/admin/helpers';
import { FormMixin } from '@intake24/admin/types';
import { SurveyForm } from '../form.vue';

export type SurveyOverridesForm = Pick<SurveyForm, 'overrides'>;

export default (Vue as VueConstructor<Vue & FormMixin<SurveyEntry, SurveyRefs>>).extend({
  name: 'SurveySchemeOverrides',

  components: { MealList, PromptList },

  mixins: [formMixin],

  data() {
    return {
      editMethod: 'patch',
      form: form<SurveyOverridesForm>({ overrides: defaultOverrides }),
    };
  },

  computed: {
    questions(): PromptQuestion[] {
      if (!this.entryLoaded || !this.refsLoaded) return [];

      const scheme = this.refs.surveySchemes.find((item) => item.id === this.entry.surveySchemeId);
      if (!scheme) return [];

      return flattenScheme(scheme.questions);
    },

    questionIds(): string[] {
      return this.form.overrides.questions.map((question) => question.id);
    },
  },
});
</script>

<style lang="scss" scoped></style>
