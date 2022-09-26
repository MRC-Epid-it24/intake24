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
              ></v-text-field>
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
              ></v-text-field>
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
              ></v-text-field>
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

import type { NutrientUnitEntry } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';

type NutrientUnitForm = {
  id: string | null;
  description: string | null;
  symbol: string | null;
};

export default defineComponent({
  name: 'NutrientTypeForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<NutrientUnitEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: form<NutrientUnitForm>({
        id: null,
        description: null,
        symbol: null,
      }),
    };
  },
});
</script>

<style lang="scss" scoped></style>
