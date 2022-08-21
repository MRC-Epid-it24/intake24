<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :error-messages="form.errors.get('id')"
                :label="$t('drinkware-sets.id')"
                disabled
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.guideImageId"
                :error-messages="form.errors.get('guideImageId')"
                :label="$t('guide-images._')"
                disabled
                hide-details="auto"
                name="guideImageId"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                :label="$t('common.description')"
                hide-details="auto"
                name="description"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { DrinkwareSetEntry } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';

type EditDrinkwareSetForm = {
  id: string | null;
  description: string | null;
  guideImageId: string | null;
};

export default defineComponent({
  name: 'EditDrinkwareSetForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<DrinkwareSetEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: form<EditDrinkwareSetForm>({
        id: null,
        guideImageId: null,
        description: null,
      }),
    };
  },
});
</script>

<style lang="scss"></style>
