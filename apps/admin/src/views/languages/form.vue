<template>
  <layout v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.code"
                :disabled="isEdit"
                :error-messages="form.errors.get('code')"
                hide-details="auto"
                :label="$t('languages.code')"
                name="code"
                outlined
                prepend-inner-icon="$languages"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.countryFlagCode"
                :error-messages="form.errors.get('countryFlagCode')"
                hide-details="auto"
                :items="flags"
                :label="$t('languages.countryFlagCode')"
                name="countryFlagCode"
                outlined
                @change="form.errors.clear('countryFlagCode')"
              >
                <template #item="{ item }">
                  <span :class="`fi fi-${item.value} mr-3`" />
                  {{ item.text }}
                </template>
                <template #selection="{ item }">
                  <span :class="`fi fi-${item.value} mr-3`" />
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.englishName"
                :error-messages="form.errors.get('englishName')"
                hide-details="auto"
                :label="$t('languages.englishName')"
                name="englishName"
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.localName"
                :error-messages="form.errors.get('localName')"
                hide-details="auto"
                :label="$t('languages.localName')"
                name="localName"
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.textDirection"
                :error-messages="form.errors.get('textDirection')"
                hide-details="auto"
                :items="textDirections"
                :label="$t('languages.textDirections._')"
                name="textDirection"
                outlined
                @change="form.errors.clear('textDirection')"
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
            <v-col cols="12" md="6">
              <v-select
                v-model="form.visibility"
                :error-messages="form.errors.get('visibility')"
                hide-details="auto"
                :items="visibilities"
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
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { RecordVisibility } from '@intake24/common/security';
import type { LanguageEntry } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm, useSelects } from '@intake24/admin/composables';

type LanguageForm = {
  id: string | null;
  code: string | null;
  englishName: string | null;
  localName: string | null;
  countryFlagCode: string;
  textDirection: string;
  visibility: RecordVisibility;
};

export default defineComponent({
  name: 'LanguageForm',

  mixins: [formMixin],

  setup(props) {
    const { flags, textDirections, visibilities } = useSelects();

    const { entry, entryLoaded, isEdit } = useEntry<LanguageEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<LanguageForm, LanguageEntry>(
      props,
      {
        data: {
          id: null,
          code: null,
          englishName: null,
          localName: null,
          countryFlagCode: 'gb',
          textDirection: 'ltr',
          visibility: 'public',
        },
      },
    );

    return {
      entry,
      entryLoaded,
      flags,
      isEdit,
      clearError,
      form,
      routeLeave,
      submit,
      textDirections,
      visibilities,
    };
  },
});
</script>

<style lang="scss" scoped></style>
