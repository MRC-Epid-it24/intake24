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
                :label="$t('standard-units.id')"
                name="id"
                outlined
                prepend-inner-icon="$standard-units"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <language-selector
                v-model="form.estimateIn"
                :label="$t('standard-units.estimateIn').toString()"
                required
              >
                <template v-for="lang in Object.keys(form.estimateIn)" #[`lang.${lang}`]>
                  <v-text-field
                    :key="lang"
                    v-model="form.estimateIn[lang]"
                    :error-messages="form.errors.get(`estimateIn.${lang}`)"
                    hide-details="auto"
                    :label="$t('standard-units.estimateIn').toString()"
                    :name="`estimateIn.${lang}`"
                    outlined
                  ></v-text-field>
                </template>
              </language-selector>
            </v-col>
            <v-col cols="12">
              <language-selector
                v-model="form.howMany"
                :label="$t('standard-units.howMany').toString()"
                required
              >
                <template v-for="lang in Object.keys(form.howMany)" #[`lang.${lang}`]>
                  <v-text-field
                    :key="lang"
                    v-model="form.howMany[lang]"
                    :error-messages="form.errors.get(`howMany.${lang}`)"
                    hide-details="auto"
                    :label="$t('standard-units.howMany').toString()"
                    :name="`howMany.${lang}`"
                    outlined
                  ></v-text-field>
                </template>
              </language-selector>
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

import type { RequiredLocaleTranslation } from '@intake24/common/types';
import type { StandardUnitEntry } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { form } from '@intake24/admin/helpers';

type StandardUnitForm = {
  id: string | null;
  estimateIn: RequiredLocaleTranslation;
  howMany: RequiredLocaleTranslation;
};

export default defineComponent({
  name: 'StandardUnitForm',

  components: { LanguageSelector },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<StandardUnitEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: form<StandardUnitForm>({
        id: null,
        estimateIn: { en: '' },
        howMany: { en: '' },
      }),
    };
  },
});
</script>

<style lang="scss" scoped></style>
