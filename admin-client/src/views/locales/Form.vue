<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded" @save="onSubmit">
    <v-form @keydown.native="clearError" @submit.prevent="onSubmit">
      <v-container>
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
              ></v-select>
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
              <v-text-field
                v-model="form.respondentLanguageId"
                :error-messages="form.errors.get('respondentLanguageId')"
                :label="$t('locales.respondentLanguageId')"
                hide-details="auto"
                name="respondentLanguageId"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.adminLanguageId"
                :error-messages="form.errors.get('adminLanguageId')"
                :label="$t('locales.adminLanguageId')"
                hide-details="auto"
                name="adminLanguageId"
                outlined
              ></v-text-field>
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
                  <span :class="`flag-icon flag-icon-${item.value} mr-3`"></span>
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.textDirection"
                :error-messages="form.errors.get('textDirection')"
                :items="textDirections"
                :label="$t('locales.textDirections._')"
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
      </v-container>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import orderBy from 'lodash/orderBy';
import formMixin from '@/components/entry/formMixin';
import Form from '@/helpers/Form';
import flags from '@/locale/en/flags';
import { FormMixin } from '@/types/vue';
import { LocaleEntryRefs } from '@common/types/api/admin/locales';
import { Locale } from '@common/types/models/system';

export default (Vue as VueConstructor<Vue & FormMixin<Locale, LocaleEntryRefs>>).extend({
  name: 'LocaleForm',

  mixins: [formMixin],

  data() {
    return {
      form: new Form({
        id: null,
        prototypeLocaleId: null,
        englishName: null,
        localName: null,
        respondentLanguageId: 'en',
        adminLanguageId: 'en',
        countryFlagCode: null,
        textDirection: 'ltr',
      }),
      textDirections: [
        { value: 'ltr', text: this.$t('locales.textDirections.ltr') },
        { value: 'rtl', text: this.$t('locales.textDirections.rtl') },
      ],
      flags: orderBy(
        Object.entries(flags).map(([key, value]) => ({ value: key, text: value })),
        'text'
      ),
    };
  },

  computed: {
    locales() {
      const locales = this.refs.locales.filter((item) => item.id !== this.entry.id);

      return [{ id: null, englishName: this.$t('common.none') as string }, ...locales];
    },
  },
});
</script>

<style lang="scss" scoped></style>
