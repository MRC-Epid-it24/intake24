<template>
  <layout v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
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
                :label="$t('languages.id')"
                name="id"
                outlined
              ></v-text-field>
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
              <v-text-field
                v-model="form.englishName"
                :error-messages="form.errors.get('englishName')"
                hide-details="auto"
                :label="$t('languages.englishName')"
                name="englishName"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.localName"
                :error-messages="form.errors.get('localName')"
                hide-details="auto"
                :label="$t('languages.localName')"
                name="localName"
                outlined
              ></v-text-field>
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

import type { LanguageEntry } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';
import { textDirections } from '@intake24/common/types';

type LanguageForm = {
  id: string | null;
  englishName: string | null;
  localName: string | null;
  countryFlagCode: string;
  textDirection: string;
};

export default defineComponent({
  name: 'LanguageForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<LanguageEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: form<LanguageForm>({
        id: null,
        englishName: null,
        localName: null,
        countryFlagCode: 'gb',
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
});
</script>

<style lang="scss" scoped></style>
