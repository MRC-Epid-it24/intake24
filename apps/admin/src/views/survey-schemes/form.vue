<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <template #actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        resource="survey-schemes"
        :scheme-id="id"
      />
    </template>
    <v-form @keydown="clearError" @submit.prevent="submit">
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data.name"
                :error-messages="errors.get('name')"
                hide-details="auto"
                :label="$t('common.name')"
                name="name"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="data.visibility"
                class="mb-4"
                :error-messages="errors.get('visibility')"
                hide-details="auto"
                :items="visibilities"
                :label="$t('securables.visibility._')"
                name="visibility"
                variant="outlined"
                @update:model-value="errors.clear('visibility')"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon :icon="item.raw.icon" start />
                    </template>
                    <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  <v-icon :icon="item.raw.icon" start />
                  {{ item.raw.title }}
                </template>
              </v-select>
            </v-col>
          </v-row>
          <div class="text-subtitle-1 font-weight-medium py-4">
            {{ $t('survey-schemes.settings.title') }}
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="data.settings.type"
                :error-messages="errors.get('settings.type')"
                hide-details="auto"
                :items="schemeTypes"
                :label="$t('survey-schemes.settings.types._')"
                name="settings.type"
                variant="outlined"
                @update:model-value="errors.clear('settings.type')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="data.settings.flow"
                :error-messages="errors.get('settings.flow')"
                hide-details="auto"
                :items="recallFlows"
                :label="$t('survey-schemes.settings.flows._')"
                name="settings.flow"
                variant="outlined"
                @update:model-value="errors.clear('settings.flow')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data.settings.recallDate"
                hide-details="auto"
                :label="$t('survey-schemes.settings.recallDate')"
                name="settings.recallDate"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="data.settings.languages"
                :error-messages="errors.get('settings.language')"
                hide-details="auto"
                item-title="englishName"
                item-value="code"
                :items="languages"
                :label="$t('survey-schemes.settings.languages')"
                multiple
                name="settings.languages"
                variant="outlined"
                @update:model-value="errors.clear('settings.languages')"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />
      <meal-list v-model="data.meals" :scheme-id="id" />
      <v-card-text>
        <submit-footer :disabled="errors.any.value" />
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { formMixin } from '@intake24/admin/components/entry';
import { MealList } from '@intake24/admin/components/lists';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { useEntry, useEntryFetch, useEntryForm, useSelects } from '@intake24/admin/composables';
import type { RecordVisibility } from '@intake24/common/security';
import type { ExportSection, Meal, RecallPrompts, SchemeSettings } from '@intake24/common/surveys';
import { defaultMeals, defaultSchemeSettings } from '@intake24/common/surveys';
import type { SurveySchemeEntry, SurveySchemeRefs } from '@intake24/common/types/http/admin';
import { useApp } from '@intake24/ui/stores';

export type SurveySchemeForm = {
  id: string | null;
  name: string | null;
  settings: SchemeSettings;
  prompts: RecallPrompts;
  meals: Meal[];
  dataExport: ExportSection[];
  visibility: RecordVisibility;
};

export type PatchSurveySchemeForm = Pick<
  SurveySchemeForm,
  'name' | 'settings' | 'meals' | 'visibility'
>;

export default defineComponent({
  name: 'SurveySchemeForm',

  components: { CopySchemeDialog, MealList },

  mixins: [formMixin],

  setup(props) {
    const { recallFlows, schemeTypes, visibilities } = useSelects();
    const languages = computed(() => useApp().langs);

    const { canHandleEntry, entry, entryLoaded, refs, refsLoaded } = useEntry<
      SurveySchemeEntry,
      SurveySchemeRefs
    >(props);
    useEntryFetch(props);
    const { clearError, form: { data, errors }, routeLeave, submit } = useEntryForm<
      PatchSurveySchemeForm,
      SurveySchemeEntry
    >(props, {
      data: {
        name: null,
        settings: defaultSchemeSettings,
        meals: defaultMeals,
        visibility: 'public',
      },
      editMethod: 'patch',
    });

    return {
      canHandleEntry,
      entry,
      entryLoaded,
      refs,
      refsLoaded,
      clearError,
      data,
      errors,
      languages,
      recallFlows,
      routeLeave,
      schemeTypes,
      submit,
      visibilities,
    };
  },
});
</script>

<style lang="scss" scoped></style>
