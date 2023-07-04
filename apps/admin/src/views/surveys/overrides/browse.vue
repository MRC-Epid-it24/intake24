<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-card-title>{{ $t('survey-schemes.overrides.prompts.title') }}</v-card-title>
    <v-card-subtitle>
      {{ $t('survey-schemes.overrides.prompts.subtitle') }}
    </v-card-subtitle>
    <prompt-list
      v-bind="{ mode: 'override', promptIds, templates: prompts }"
      :items.sync="form.surveySchemeOverrides.prompts"
    ></prompt-list>
    <meal-list
      v-model="form.surveySchemeOverrides.meals"
      class="mt-4"
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

import type { Prompt } from '@intake24/common/prompts';
import type { SchemeOverrides } from '@intake24/common/surveys';
import type { SurveyEntry, SurveyRefs } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { MealList } from '@intake24/admin/components/lists';
import PromptList from '@intake24/admin/components/prompts/list/prompt-list.vue';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { defaultOverrides, flattenScheme } from '@intake24/common/surveys';

export type SurveyOverridesForm = { surveySchemeOverrides: SchemeOverrides };

export default defineComponent({
  name: 'SurveySchemeOverrides',

  components: { MealList, PromptList },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useEntry<SurveyEntry, SurveyRefs>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<SurveyOverridesForm, SurveyEntry>(
      props,
      { data: { surveySchemeOverrides: defaultOverrides }, editMethod: 'patch' }
    );

    return {
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
    prompts(): Prompt[] {
      if (!this.entryLoaded || !this.refsLoaded) return [];

      const scheme = this.refs.surveySchemes.find((item) => item.id === this.entry.surveySchemeId);
      if (!scheme) return [];

      return flattenScheme(scheme.prompts);
    },

    promptIds(): string[] {
      return this.form.surveySchemeOverrides.prompts.map(({ id }) => id);
    },
  },
});
</script>

<style lang="scss" scoped></style>
