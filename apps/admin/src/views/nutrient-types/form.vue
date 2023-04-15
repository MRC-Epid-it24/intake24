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
                :label="$t('nutrient-types.id')"
                name="id"
                outlined
                prepend-inner-icon="$nutrient-types"
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
              <v-select
                v-model="form.unitId"
                :error-messages="form.errors.get('unitId')"
                hide-details="auto"
                item-text="description"
                item-value="id"
                :items="nutrientUnits"
                :label="$t('nutrient-units._')"
                name="unitId"
                outlined
                prepend-inner-icon="$nutrient-units"
                @change="form.errors.clear('unitId')"
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.kcalPerUnit"
                :error-messages="form.errors.get('kcalPerUnit')"
                hide-details="auto"
                :label="$t('nutrient-types.kcalPerUnit')"
                name="kcalPerUnit"
                outlined
                prepend-inner-icon="fas fa-bolt"
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

import type { NutrientTypeEntry, NutrientTypeRefs } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { createForm } from '@intake24/admin/util';

type NutrientTypeForm = {
  id: string | null;
  description: string | null;
  unitId: string | null;
  kcalPerUnit: number | null;
};

export default defineComponent({
  name: 'NutrientTypeForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<
      NutrientTypeEntry,
      NutrientTypeRefs
    >(props);

    return { entry, entryLoaded, refs, refsLoaded };
  },

  data() {
    return {
      form: createForm<NutrientTypeForm>({
        id: null,
        description: null,
        unitId: null,
        kcalPerUnit: null,
      }),
    };
  },

  computed: {
    nutrientUnits() {
      const nutrientUnits = [{ id: null, description: this.$t('common.none').toString() }];

      if (!this.refs.units) return nutrientUnits;

      return [...nutrientUnits, ...this.refs.units];
    },
  },
});
</script>

<style lang="scss" scoped></style>
