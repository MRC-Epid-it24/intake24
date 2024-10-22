<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="data.name"
                :error-messages="errors.get('name')"
                hide-details="auto"
                :label="$t('common.name')"
                name="name"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <submit-footer :disabled="errors.any.value" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import type { FoodGroupAttributes } from '@intake24/common/types/http/admin';

type FoodGroupForm = {
  id: string | null;
  name: string | null;
};

export default defineComponent({
  name: 'FoodGroupForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<FoodGroupAttributes>(props);
    useEntryFetch(props);
    const { clearError, form: { data, errors }, routeLeave, submit } = useEntryForm<FoodGroupForm, FoodGroupAttributes>(
      props,
      {
        data: { id: null, name: null },
      },
    );

    return { entry, entryLoaded, clearError, data, errors, routeLeave, submit };
  },
});
</script>

<style scoped></style>
