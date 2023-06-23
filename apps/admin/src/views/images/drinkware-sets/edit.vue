<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                disabled
                :error-messages="form.errors.get('id')"
                hide-details="auto"
                :label="$t('drinkware-sets.id')"
                name="id"
                outlined
                prepend-inner-icon="$drinkware-sets"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.imageMapId"
                disabled
                :error-messages="form.errors.get('imageMapId')"
                hide-details="auto"
                :label="$t('image-maps._')"
                name="imageMapId"
                outlined
                prepend-inner-icon="$image-maps"
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
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

type EditDrinkwareSetForm = {
  id: string | null;
  description: string | null;
  imageMapId: string | null;
};

export default defineComponent({
  name: 'EditDrinkwareSetForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<DrinkwareSetEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      EditDrinkwareSetForm,
      DrinkwareSetEntry
    >(props, {
      data: { id: null, imageMapId: null, description: null },
    });

    return { entry, entryLoaded, clearError, form, routeLeave, submit };
  },
});
</script>

<style lang="scss"></style>
