<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <template #actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        resource="survey-schemes"
        :scheme-id="id"
      />
    </template>
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container fluid>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('common.name')"
                name="name"
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.type"
                :error-messages="form.errors.get('type')"
                hide-details="auto"
                :items="schemeTypeItems"
                :label="$t('survey-schemes.types._')"
                name="type"
                outlined
                @change="form.errors.clear('type')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.visibility"
                class="mb-4"
                :error-messages="form.errors.get('visibility')"
                hide-details="auto"
                :items="visibilityList"
                :label="$t('securables.visibility._')"
                name="visibility"
                outlined
                @change="form.errors.clear('visibility')"
              >
                <template #item="{ item }">
                  <v-icon left>
                    {{ item.icon }}
                  </v-icon>
                  {{ item.text }}
                </template>
                <template #selection="{ item }">
                  <v-icon left>
                    {{ item.icon }}
                  </v-icon>
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-divider />
      <meal-list v-model="form.meals" :scheme-id="id" />
      <v-card-text>
        <submit-footer :disabled="form.errors.any()" />
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { RecordVisibility } from '@intake24/common/security';
import type { ExportSection, Meal, RecallPrompts, SchemeType } from '@intake24/common/surveys';
import type { SurveySchemeEntry, SurveySchemeRefs } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { MealList } from '@intake24/admin/components/lists';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { useEntry, useEntryFetch, useEntryForm, useSelects } from '@intake24/admin/composables';
import { defaultMeals, schemeTypes } from '@intake24/common/surveys';
import { useI18n } from '@intake24/i18n';

export type SurveySchemeForm = {
  id: string | null;
  name: string | null;
  type: SchemeType;
  version: number;
  prompts: RecallPrompts;
  meals: Meal[];
  dataExport: ExportSection[];
  visibility: RecordVisibility;
};

export type PatchSurveySchemeForm = Pick<
  SurveySchemeForm,
  'name' | 'version' | 'type' | 'meals' | 'visibility'
>;

export default defineComponent({
  name: 'SurveySchemeForm',

  components: { CopySchemeDialog, MealList },

  mixins: [formMixin],

  setup(props) {
    const { i18n } = useI18n();
    const { visibilityList } = useSelects();

    const schemeTypeItems = ref(
      schemeTypes.map(value => ({
        value,
        text: i18n.t(`survey-schemes.types.${value}`),
      })),
    );

    const { canHandleEntry, entry, entryLoaded, refs, refsLoaded } = useEntry<
      SurveySchemeEntry,
      SurveySchemeRefs
    >(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      PatchSurveySchemeForm,
      SurveySchemeEntry
    >(props, {
      data: { name: null, version: 2, type: 'default', meals: defaultMeals, visibility: 'public' },
      editMethod: 'patch',
    });

    return {
      schemeTypeItems,
      canHandleEntry,
      entry,
      entryLoaded,
      refs,
      refsLoaded,
      clearError,
      form,
      routeLeave,
      submit,
      visibilityList,
    };
  },
});
</script>

<style lang="scss" scoped></style>
