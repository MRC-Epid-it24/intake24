<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :disabled="isEdit"
                :error-messages="form.errors.get('id')"
                hide-details="auto"
                :label="$t('locales.id')"
                name="id"
                outlined
                prepend-inner-icon="$locales"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.prototypeLocaleId"
                :error-messages="form.errors.get('prototypeLocaleId')"
                hide-details="auto"
                item-text="englishName"
                item-value="id"
                :items="locales"
                :label="$t('locales.prototypeLocaleId')"
                name="locale"
                outlined
                @change="form.errors.clear('prototypeLocaleId')"
              >
                <template #item="{ item }">
                  <span v-if="item.id" :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  <v-icon v-else left>fas fa-flag</v-icon>
                  {{ item.englishName }}
                </template>
                <template #selection="{ item }">
                  <span v-if="item.id" :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  <v-icon v-else left>fas fa-flag</v-icon>
                  {{ item.englishName }}
                </template>
              </v-select>
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
              <v-select
                v-model="form.respondentLanguageId"
                :error-messages="form.errors.get('respondentLanguageId')"
                hide-details="auto"
                item-text="englishName"
                item-value="id"
                :items="refs.languages"
                :label="$t('locales.respondentLanguageId')"
                name="respondentLanguageId"
                outlined
                @change="form.errors.clear('respondentLanguageId')"
              >
                <template #item="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
                <template #selection="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.adminLanguageId"
                :error-messages="form.errors.get('adminLanguageId')"
                hide-details="auto"
                item-text="englishName"
                item-value="id"
                :items="refs.languages"
                :label="$t('locales.adminLanguageId')"
                name="adminLanguageId"
                outlined
                @change="form.errors.clear('adminLanguageId')"
              >
                <template #item="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
                <template #selection="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
              </v-select>
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
                :items="textDirections"
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
          </v-row>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import orderBy from 'lodash/orderBy';
import { defineComponent } from 'vue';

import type { LocaleEntry, LocaleRefs } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';
import { textDirections } from '@intake24/common/types';

type LocaleForm = {
  id: string | null;
  prototypeLocaleId: string | null;
  englishName: string | null;
  localName: string | null;
  respondentLanguageId: string;
  adminLanguageId: string;
  countryFlagCode: string | null;
  textDirection: string;
};

export default defineComponent({
  name: 'LocaleForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<LocaleEntry, LocaleRefs>(
      props.id
    );

    return { entry, entryLoaded, refs, refsLoaded };
  },

  data() {
    return {
      form: form<LocaleForm>({
        id: null,
        prototypeLocaleId: null,
        englishName: null,
        localName: null,
        respondentLanguageId: 'en',
        adminLanguageId: 'en',
        countryFlagCode: null,
        textDirection: 'ltr',
      }),
      flags: orderBy(
        Object.entries(this.$i18n.messages[this.$i18n.locale].flags).map(([key, value]) => ({
          value: key,
          text: value,
        })),
        'text'
      ),
      textDirections: textDirections.map((value) => ({
        value,
        text: this.$t(`languages.textDirections.${value}`),
        icon: value === 'ltr' ? 'fas fa-right-long' : 'fas fa-left-long',
      })),
    };
  },

  computed: {
    locales() {
      const locales = [{ id: null, englishName: this.$t('common.none').toString() }];

      if (!this.refs.locales) return locales;

      const availableLocales = this.refs.locales.filter((locale) => locale.id !== this.id);

      return [...locales, ...availableLocales];
    },
  },
});
</script>

<style lang="scss" scoped></style>
