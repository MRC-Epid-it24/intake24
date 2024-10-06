<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown="clearError" @submit.prevent="submit">
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
                prepend-inner-icon="$standard-units"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('common.name')"
                name="name"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <language-selector
                v-model="form.estimateIn"
                border
                :label="$t('standard-units.estimateIn')"
                required
              >
                <template v-for="lang in Object.keys(form.estimateIn)" :key="lang" #[`lang.${lang}`]>
                  <v-text-field
                    v-model="form.estimateIn[lang]"
                    :error-messages="form.errors.get(`estimateIn.${lang}`)"
                    hide-details="auto"
                    :name="`estimateIn.${lang}`"
                    variant="outlined"
                    @update:model-value="form.errors.clear(`estimateIn.${lang}`)"
                  />
                </template>
              </language-selector>
            </v-col>
            <v-col cols="12">
              <language-selector
                v-model="form.howMany"
                border
                :label="$t('standard-units.howMany')"
                required
              >
                <template v-for="lang in Object.keys(form.howMany)" :key="lang" #[`lang.${lang}`]>
                  <v-text-field
                    v-model="form.howMany[lang]"
                    :error-messages="form.errors.get(`howMany.${lang}`)"
                    hide-details="auto"
                    :name="`howMany.${lang}`"
                    variant="outlined"
                    @update:model-value="form.errors.clear(`howMany.${lang}`)"
                  />
                </template>
              </language-selector>
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

import type { RequiredLocaleTranslation } from '@intake24/common/types';
import type { StandardUnitAttributes } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

type StandardUnitForm = {
  id: string | null;
  name: string | null;
  estimateIn: RequiredLocaleTranslation;
  howMany: RequiredLocaleTranslation;
};

export default defineComponent({
  name: 'StandardUnitForm',

  components: { LanguageSelector },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, isEdit } = useEntry<StandardUnitAttributes>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      StandardUnitForm,
      StandardUnitAttributes
    >(props, {
      data: { id: null, name: null, estimateIn: { en: '' }, howMany: { en: '' } },
    });

    return { entry, entryLoaded, isEdit, clearError, form, routeLeave, submit };
  },
});
</script>

<style lang="scss" scoped></style>
