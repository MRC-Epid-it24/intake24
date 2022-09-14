<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
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
      v-model="form.surveySchemeOverrides.meals"
      mode="override"
      :scheme-id="entry.surveySchemeId"
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
import { defineComponent } from 'vue';

import type { PromptQuestion } from '@intake24/common/prompts';
import type { SchemeOverrides } from '@intake24/common/schemes';
import type { SurveyEntry, SurveyRefs } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { MealList } from '@intake24/admin/components/lists';
import PromptList from '@intake24/admin/components/prompts/list/prompt-list.vue';
import { form } from '@intake24/admin/helpers';
import { defaultOverrides, flattenScheme } from '@intake24/common/schemes';

export type SurveyOverridesForm = { surveySchemeOverrides: SchemeOverrides };

export default defineComponent({
  name: 'SurveySchemeOverrides',

  components: { MealList, PromptList },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<SurveyEntry, SurveyRefs>(
      props.id
    );

    return { entry, entryLoaded, refs, refsLoaded };
  },

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
