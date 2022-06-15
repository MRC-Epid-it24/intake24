<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :disabled="isEdit"
                :error-messages="form.errors.get('id')"
                :label="$t('locales.id')"
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.prototypeLocaleId"
                :items="locales"
                :error-messages="form.errors.get('prototypeLocaleId')"
                :label="$t('locales.prototypeLocaleId')"
                hide-details="auto"
                item-value="id"
                item-text="englishName"
                name="locale"
                outlined
                @change="form.errors.clear('prototypeLocaleId')"
              >
                <template v-slot:item="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
                <template v-slot:selection="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.englishName"
                :error-messages="form.errors.get('englishName')"
                :label="$t('locales.englishName')"
                hide-details="auto"
                name="englishName"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.localName"
                :error-messages="form.errors.get('localName')"
                :label="$t('locales.localName')"
                hide-details="auto"
                name="localName"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.respondentLanguageId"
                :error-messages="form.errors.get('respondentLanguageId')"
                :items="refs.languages"
                :label="$t('locales.respondentLanguageId')"
                hide-details="auto"
                item-value="id"
                item-text="englishName"
                name="respondentLanguageId"
                outlined
                @change="form.errors.clear('respondentLanguageId')"
              >
                <template v-slot:item="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
                <template v-slot:selection="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.adminLanguageId"
                :error-messages="form.errors.get('adminLanguageId')"
                :items="refs.languages"
                :label="$t('locales.adminLanguageId')"
                hide-details="auto"
                item-value="id"
                item-text="englishName"
                name="adminLanguageId"
                outlined
                @change="form.errors.clear('adminLanguageId')"
              >
                <template v-slot:item="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
                <template v-slot:selection="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.countryFlagCode"
                :error-messages="form.errors.get('countryFlagCode')"
                :items="flags"
                :label="$t('locales.countryFlagCode')"
                hide-details="auto"
                name="countryFlagCode"
                outlined
                @change="form.errors.clear('countryFlagCode')"
              >
                <template v-slot:item="{ item }">
                  <span :class="`fi fi-${item.value} mr-3`"></span>
                  {{ item.text }}
                </template>
                <template v-slot:selection="{ item }">
                  <span :class="`fi fi-${item.value} mr-3`"></span>
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.textDirection"
                :error-messages="form.errors.get('textDirection')"
                :items="textDirections"
                :label="$t('languages.textDirections._')"
                hide-details="auto"
                name="textDirection"
                outlined
                @change="form.errors.clear('textDirection')"
              >
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
import Vue, { VueConstructor } from 'vue';
import orderBy from 'lodash/orderBy';
import type { LocaleEntry, LocaleRefs } from '@intake24/common/types/http/admin';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';
import type { FormMixin } from '@intake24/admin/types';

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

export default (Vue as VueConstructor<Vue & FormMixin<LocaleEntry, LocaleRefs>>).extend({
  name: 'LocaleForm',

  mixins: [formMixin],

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
      textDirections: [
        { value: 'ltr', text: this.$t('languages.textDirections.ltr') },
        { value: 'rtl', text: this.$t('languages.textDirections.rtl') },
      ],
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
