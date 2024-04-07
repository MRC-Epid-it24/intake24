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
                :label="$t('nutrient-units.id')"
                name="id"
                outlined
                prepend-inner-icon="$nutrient-units"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                hide-details="auto"
                :label="$t('common.description')"
                name="description"
                outlined
                prepend-inner-icon="$description"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.symbol"
                :error-messages="form.errors.get('symbol')"
                hide-details="auto"
                :label="$t('nutrient-units.symbol')"
                name="symbol"
                outlined
                prepend-inner-icon="fa-square-root-variable"
              />
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

import type { NutrientUnitAttributes } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

type NutrientUnitForm = {
  id: string | null;
  description: string | null;
  symbol: string | null;
};

export default defineComponent({
  name: 'NutrientTypeForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, isEdit } = useEntry<NutrientUnitAttributes>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      NutrientUnitForm,
      NutrientUnitAttributes
    >(props, {
      data: { id: null, description: null, symbol: null },
    });

    return { entry, entryLoaded, isEdit, clearError, form, routeLeave, submit };
  },
});
</script>

<style lang="scss" scoped></style>
