<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
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
                :label="$t('locales.code')"
                name="code"
                outlined
                prepend-inner-icon="$locales"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <select-resource
                v-model="form.prototypeLocaleId"
                clearable
                :error-messages="form.errors.get('prototypeLocaleId')"
                :initial-item="entry.parent"
                item-id="code"
                item-name="englishName"
                :label="$t('locales.prototypeLocaleId')"
                name="prototypeLocaleId"
                resource="locales"
                @input="form.errors.clear('prototypeLocaleId')"
              >
              </select-resource>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.englishName"
                :error-messages="form.errors.get('englishName')"
                hide-details="auto"
                :label="$t('locales.englishName')"
                name="englishName"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.localName"
                :error-messages="form.errors.get('localName')"
                hide-details="auto"
                :label="$t('locales.localName')"
                name="localName"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <select-resource
                v-model="form.respondentLanguageId"
                :error-messages="form.errors.get('respondentLanguageId')"
                :initial-item="entry.respondentLanguage"
                item-id="code"
                item-name="englishName"
                :label="$t('locales.respondentLanguageId')"
                name="respondentLanguageId"
                resource="languages"
                @input="form.errors.clear('respondentLanguageId')"
              >
              </select-resource>
            </v-col>
            <v-col cols="12" md="6">
              <select-resource
                v-model="form.adminLanguageId"
                :error-messages="form.errors.get('adminLanguageId')"
                :initial-item="entry.adminLanguage"
                item-id="code"
                item-name="englishName"
                :label="$t('locales.adminLanguageId')"
                name="adminLanguageId"
                resource="languages"
                @input="form.errors.clear('adminLanguageId')"
              >
              </select-resource>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.countryFlagCode"
                :error-messages="form.errors.get('countryFlagCode')"
                hide-details="auto"
                :items="flags"
                :label="$t('locales.countryFlagCode')"
                name="countryFlagCode"
                outlined
                @change="form.errors.clear('countryFlagCode')"
              >
                <template #item="{ item }">
                  <span :class="`fi fi-${item.value} mr-3`"></span>
                  {{ item.text }}
                </template>
                <template #selection="{ item }">
                  <span :class="`fi fi-${item.value} mr-3`"></span>
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.textDirection"
                :error-messages="form.errors.get('textDirection')"
                hide-details="auto"
                :items="textDirectionList"
                :label="$t('languages.textDirections._')"
                name="textDirection"
                outlined
                @change="form.errors.clear('textDirection')"
              >
                <template #item="{ item }">
                  <v-icon left>{{ item.icon }}</v-icon>
                  {{ item.text }}
                </template>
                <template #selection="{ item }">
                  <v-icon left>{{ item.icon }}</v-icon>
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.visibility"
                :error-messages="form.errors.get('visibility')"
                hide-details="auto"
                :items="visibilityList"
                :label="$t('securables.visibility._')"
                name="visibility"
                outlined
                @change="form.errors.clear('visibility')"
              >
                <template #item="{ item }">
                  <v-icon left>{{ item.icon }}</v-icon>
                  {{ item.text }}
                </template>
                <template #selection="{ item }">
                  <v-icon left>{{ item.icon }}</v-icon>
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-h5 mb-4">{{ $t('locales.foodIndex._') }}</div>
              <v-switch
                v-model="form.foodIndexEnabled"
                class="mb-4"
                hide-details="auto"
                :label="$t('locales.foodIndex.enabled')"
                name="foodIndexEnabled"
              ></v-switch>
              <v-select
                v-model="form.foodIndexLanguageBackendId"
                :error-messages="form.errors.get('foodIndexLanguageBackendId')"
                hide-details="auto"
                :items="foodIndexLanguageBackends"
                :label="$t('locales.foodIndex.languageBackend')"
                name="textDirection"
                outlined
                @change="form.errors.clear('foodIndexLanguageBackendId')"
              >
                <template #item="{ item }">
                  <span :class="`fi fi-${item.value} mr-3`"></span>
                  {{ item.text }}
                </template>
                <template #selection="{ item }">
                  <span :class="`fi fi-${item.value} mr-3`"></span>
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
          </v-row>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { RecordVisibility } from '@intake24/common/security';
import type { LocaleEntry, LocaleRefs } from '@intake24/common/types/http/admin';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm, useSelects } from '@intake24/admin/composables';

type LocaleForm = {
  id: string | null;
  code: string | null;
  prototypeLocaleId: string | null;
  englishName: string | null;
  localName: string | null;
  respondentLanguageId: string;
  adminLanguageId: string;
  countryFlagCode: string | null;
  textDirection: string;
  foodIndexEnabled: boolean;
  foodIndexLanguageBackendId: string;
  visibility: RecordVisibility;
};

export default defineComponent({
  name: 'LocaleForm',

  components: { SelectResource },

  mixins: [formMixin],

  setup(props) {
    const { flags, textDirectionList, visibilityList } = useSelects();

    const { entry, entryLoaded, isEdit, refs, refsLoaded } = useEntry<LocaleEntry, LocaleRefs>(
      props
    );
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<LocaleForm, LocaleEntry>(props, {
      data: {
        id: null,
        code: null,
        prototypeLocaleId: null,
        englishName: null,
        localName: null,
        respondentLanguageId: 'en',
        adminLanguageId: 'en',
        countryFlagCode: null,
        textDirection: 'ltr',
        foodIndexEnabled: false,
        foodIndexLanguageBackendId: 'en',
        visibility: 'public',
      },
    });

    return {
      entry,
      entryLoaded,
      isEdit,
      flags,
      refs,
      refsLoaded,
      clearError,
      form,
      routeLeave,
      submit,
      textDirectionList,
      visibilityList,
    };
  },

  computed: {
    foodIndexLanguageBackends() {
      if (!this.refs.foodIndexLanguageBackends)
        return [{ value: 'en', text: this.$t('common.none').toString() }];

      return this.refs.foodIndexLanguageBackends.map((backend) => ({
        value: backend.id,
        text: backend.name,
      }));
    },
  },
});
</script>

<style lang="scss" scoped></style>
