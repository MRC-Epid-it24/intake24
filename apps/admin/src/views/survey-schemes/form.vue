<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <template v-slot:actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        :schemeId="id"
        resource="survey-schemes"
      ></copy-scheme-dialog>
    </template>
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                :label="$t('common.name')"
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.type"
                :items="schemeTypes"
                :error-messages="form.errors.get('type')"
                :label="$t('survey-schemes.types._')"
                hide-details="auto"
                name="type"
                outlined
                @change="form.errors.clear('type')"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-divider></v-divider>
      <meal-list :schemeId="id" v-model="form.meals"></meal-list>
      <v-card-text>
        <submit-footer :disabled="form.errors.any()"></submit-footer>
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ExportSection, RecallQuestions, SchemeType } from '@intake24/common/schemes';
import type { Meal } from '@intake24/common/types';
import type { SurveySchemeEntry, SurveySchemeRefs } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import MealList from '@intake24/admin/components/meals/meal-list.vue';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { form } from '@intake24/admin/helpers';
import { defaultMeals, schemeTypes } from '@intake24/common/schemes';

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
    const { canHandleEntry, entry, entryLoaded, refs, refsLoaded } = useStoreEntry<
      SurveySchemeEntry,
      SurveySchemeRefs
    >(props.id);

    return { canHandleEntry, entry, entryLoaded, refs, refsLoaded };
  },

  data() {
    return {
      editMethod: 'patch',
      form: form<PatchSurveySchemeForm>({
        name: null,
        type: 'default',
        meals: defaultMeals,
      }),
      schemeTypes: schemeTypes.map((value) => ({
        value,
        text: this.$t(`survey-schemes.types.${value}`),
      })),
    };
  },
});
</script>

<style lang="scss" scoped></style>
