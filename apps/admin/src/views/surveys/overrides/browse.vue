<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-card-title>{{ $t('survey-schemes.overrides.questions.title') }}</v-card-title>
    <v-card-subtitle>
      {{ $t('survey-schemes.overrides.questions.subtitle') }}
    </v-card-subtitle>
    <prompt-list
      v-bind="{ mode: 'override', questionIds, templates: questions }"
      :items.sync="form.surveySchemeOverrides.questions"
    ></prompt-list>
    <v-card-title>{{ $t('survey-schemes.overrides.meals.title') }}</v-card-title>
    <v-card-subtitle>
      {{ $t('survey-schemes.overrides.meals.subtitle') }}
    </v-card-subtitle>
    <meal-list
      :schemeId="entry.surveySchemeId"
      v-model="form.surveySchemeOverrides.meals"
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
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { SchemeOverrides } from '@intake24/common/schemes';
import { defaultOverrides, flattenScheme } from '@intake24/common/schemes';
import type { SurveyEntry, SurveyRefs } from '@intake24/common/types/http/admin';
import type { PromptQuestion } from '@intake24/common/prompts';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import MealList from '@intake24/admin/components/meals/meal-list.vue';
import PromptList from '@intake24/admin/components/prompts/list/prompt-list.vue';
import { form } from '@intake24/admin/helpers';
import type { FormMixin } from '@intake24/admin/types';

export type SurveyOverridesForm = { surveySchemeOverrides: SchemeOverrides };

export default (Vue as VueConstructor<Vue & FormMixin<SurveyEntry, SurveyRefs>>).extend({
  name: 'SurveySchemeOverrides',

  components: { MealList, PromptList },

  mixins: [formMixin],

  data() {
    return {
      editMethod: 'patch',
      form: form<SurveyOverridesForm>({ surveySchemeOverrides: defaultOverrides }),
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
      return this.form.surveySchemeOverrides.questions.map((question) => question.id);
    },
  },
});
</script>

<style lang="scss" scoped></style>
