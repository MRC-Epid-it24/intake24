<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :error-messages="form.errors.get('id')"
                :label="$t('drinkware-sets.id')"
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.guideImageId"
                :items="refs.guideImages"
                :label="$t('guide-images._')"
                :error-messages="form.errors.get('guideImageId')"
                item-value="id"
                item-text="description"
                hide-details="auto"
                name="guideImageId"
                outlined
                @change="form.errors.clear('guideImageId')"
              >
                <template v-slot:item="{ item }">
                  {{ `${item.id} (${item.description})` }}
                </template>
                <template v-slot:selection="{ item }">
                  {{ `${item.id} (${item.description})` }}
                </template>
              </v-select>
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

type CreateDrinkwareSetForm = {
  id: string | null;
  description: string | null;
  guideImageId: string | null;
};

export default defineComponent({
  name: 'CreateDrinkwareSetForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<DrinkwareSetEntry>(props.id);

    return { entry, entryLoaded, refs, refsLoaded };
  },

  data() {
    return {
      form: form<CreateDrinkwareSetForm>({
        id: null,
        description: null,
        guideImageId: null,
      }),
    };
  },
});
</script>

<style lang="scss"></style>
