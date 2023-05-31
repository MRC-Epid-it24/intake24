<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <template #actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        resource="survey-schemes"
        :scheme-id="id"
      ></copy-scheme-dialog>
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
              ></v-text-field>
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
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-divider></v-divider>
      <meal-list v-model="form.meals" :scheme-id="id"></meal-list>
      <v-card-text>
        <submit-footer :disabled="form.errors.any()"></submit-footer>
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { ExportSection, RecallQuestions, SchemeType } from '@intake24/common/surveys';
import type { Meal } from '@intake24/common/types';
import type { SurveySchemeEntry, SurveySchemeRefs } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { MealList } from '@intake24/admin/components/lists';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { defaultMeals, schemeTypes } from '@intake24/common/surveys';
import { useI18n } from '@intake24/i18n';

export type SurveySchemeForm = {
  id: string | null;
  name: string | null;
  type: SchemeType;
  questions: RecallQuestions;
  meals: Meal[];
  dataExport: ExportSection[];
};

export type PatchSurveySchemeForm = Pick<SurveySchemeForm, 'name' | 'type' | 'meals'>;

export default defineComponent({
  name: 'SurveySchemeForm',

  components: { CopySchemeDialog, MealList },

  mixins: [formMixin],

  setup(props) {
    const i18n = useI18n();

    const schemeTypeItems = ref(
      schemeTypes.map((value) => ({
        value,
        text: i18n.t(`survey-schemes.types.${value}`),
      }))
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
      data: { name: null, type: 'default', meals: defaultMeals },
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
    };
  },
});
</script>

<style lang="scss" scoped></style>
