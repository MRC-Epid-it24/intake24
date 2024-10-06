<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :error-messages="form.errors.get('id')"
                hide-details="auto"
                :label="$t('as-served-sets.id')"
                name="id"
                prepend-inner-icon="$as-served-sets"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input
                v-model="form.selectionImage"
                :error-messages="form.errors.get('selectionImage')"
                hide-details="auto"
                :label="$t('as-served-sets.selectionImage')"
                name="selectionImage"
                prepend-icon=""
                prepend-inner-icon="fas fa-paperclip"
                variant="outlined"
                @change="form.errors.clear('selectionImage')"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                hide-details="auto"
                :label="$t('common.description')"
                name="description"
                prepend-inner-icon="$description"
                variant="outlined"
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

import type { AsServedSetEntry } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

type CreateAsServedSetForm = {
  id: string | null;
  description: string | null;
  selectionImage: File | null;
};

export default defineComponent({
  name: 'CreateAsServedSetForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<AsServedSetEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      CreateAsServedSetForm,
      AsServedSetEntry
    >(props, {
      data: { id: null, description: null, selectionImage: null },
      config: { multipart: true },
    });

    return { entry, entryLoaded, clearError, form, routeLeave, submit };
  },
});
</script>

<style lang="scss"></style>
