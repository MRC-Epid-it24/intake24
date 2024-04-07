<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :disabled="isEdit"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('common.name')"
                name="name"
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.displayName"
                :error-messages="form.errors.get('displayName')"
                hide-details="auto"
                :label="$t('common.displayName')"
                name="displayName"
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                hide-details="auto"
                :label="$t('common.description')"
                name="description"
                outlined
                prepend-inner-icon="$description"
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

import type { PermissionEntry } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

type PermissionForm = {
  id: string | null;
  name: string | null;
  displayName: string | null;
  description: string | null;
};

export default defineComponent({
  name: 'PermissionForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, isEdit } = useEntry<PermissionEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<PermissionForm, PermissionEntry>(
      props,
      {
        data: { id: null, name: null, displayName: null, description: null },
      },
    );

    return { entry, entryLoaded, isEdit, clearError, form, routeLeave, submit };
  },
});
</script>

<style scoped></style>
