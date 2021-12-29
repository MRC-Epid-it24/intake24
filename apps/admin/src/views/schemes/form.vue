<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <template v-slot:actions>
      <copy-scheme-dialog v-if="isEdit && can('schemes-edit')" :schemeId="id"></copy-scheme-dialog>
    </template>
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.id"
                :disabled="isEdit"
                :error-messages="form.errors.get('id')"
                :label="$t('schemes.id')"
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                :label="$t('schemes.name')"
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.type"
                :items="types"
                :error-messages="form.errors.get('type')"
                :label="$t('schemes.types._')"
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
import Vue, { VueConstructor } from 'vue';
import { defaultExport, defaultMeals, defaultQuestions, RecallQuestions } from '@common/schemes';
import { Meal } from '@common/types';
import { ExportSection } from '@common/types/models';
import formMixin from '@/components/entry/form-mixin';
import MealList from '@/components/meals/meal-list.vue';
import { form } from '@/helpers';
import { FormMixin } from '@/types';
import CopySchemeDialog from './copy-scheme-dialog.vue';

export type SchemeForm = {
  id: string | null;
  name: string | null;
  type: string;
  questions: RecallQuestions;
  meals: Meal[];
  export: ExportSection[];
};

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'SchemeForm',

  components: { CopySchemeDialog, MealList },

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
      types: [{ value: 'data-driven', text: this.$t('schemes.types.data-driven') }],
    };
  },

  methods: {
    resetMeals() {
      this.form.meals = this.refs.meals;
    },
  },
});
</script>

<style lang="scss" scoped></style>
