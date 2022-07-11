<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                :label="$t('common.name')"
                hide-details="auto"
                name="name"
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
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';
import type { FoodGroupEntry } from '@intake24/common/types/http/admin';

type FoodGroupForm = {
  id: string | null;
  name: string | null;
};

export default defineComponent({
  name: 'FoodGroupForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<FoodGroupEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: form<FoodGroupForm>({ id: null, name: null }),
    };
  },
});
</script>

<style scoped></style>
