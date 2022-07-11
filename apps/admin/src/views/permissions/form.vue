<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :disabled="isEdit"
                :error-messages="form.errors.get('name')"
                :label="$t('common.name')"
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.displayName"
                :error-messages="form.errors.get('displayName')"
                :label="$t('common.displayName')"
                hide-details="auto"
                name="displayName"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                :label="$t('common.description')"
                hide-details="auto"
                name="description"
                outlined
              ></v-textarea>
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
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';
import type { PermissionEntry } from '@intake24/common/types/http/admin';

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
    const { entry, entryLoaded } = useStoreEntry<PermissionEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: form<PermissionForm>({
        id: null,
        name: null,
        displayName: null,
        description: null,
      }),
    };
  },
});
</script>

<style scoped></style>
