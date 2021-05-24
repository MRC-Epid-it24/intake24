<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :disabled="isEdit"
                :error-messages="form.errors.get('id')"
                :label="$t('languages.id')"
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.countryFlagCode"
                :error-messages="form.errors.get('countryFlagCode')"
                :items="flags"
                :label="$t('languages.countryFlagCode')"
                hide-details="auto"
                name="countryFlagCode"
                outlined
                @change="form.errors.clear('countryFlagCode')"
              >
                <template v-slot:item="{ item }">
                  <span :class="`flag-icon flag-icon-${item.value} mr-3`"></span>
                  {{ item.text }}
                </template>
                <template v-slot:selection="{ item }">
                  <span :class="`flag-icon flag-icon-${item.value} mr-3`"></span>
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.englishName"
                :error-messages="form.errors.get('englishName')"
                :label="$t('languages.englishName')"
                hide-details="auto"
                name="englishName"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.localName"
                :error-messages="form.errors.get('localName')"
                :label="$t('languages.localName')"
                hide-details="auto"
                name="localName"
                outlined
              ></v-text-field>
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
      </v-container>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import orderBy from 'lodash/orderBy';
import formMixin from '@/components/entry/formMixin';
import form from '@/helpers/Form';
import { FormMixin } from '@/types/vue';

type LanguageForm = {
  id: string | null;
  englishName: string | null;
  localName: string | null;
  countryFlagCode: string;
  textDirection: string;
};

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'LanguageForm',

  mixins: [formMixin],

  data() {
    return {
      form: form<LanguageForm>({
        id: null,
        englishName: null,
        localName: null,
        countryFlagCode: 'en',
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
});
</script>

<style lang="scss" scoped></style>
