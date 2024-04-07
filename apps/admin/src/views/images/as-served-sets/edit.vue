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
                :label="$t('as-served-sets.id')"
                name="id"
                outlined
                prepend-inner-icon="$as-served-sets"
              />
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
              />
            </v-col>
          </v-row>
        </v-card-text>
        <error-list :errors="nonInputErrors" tag="v-card-text" />
        <as-served-images
          :items="entry.images"
          :set-id="entry.id"
          @images="updateImages"
        />
        <v-card-text>
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { AsServedImageInput, AsServedSetEntry } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

import AsServedImages from './images.vue';

type EditAsServedSetForm = {
  id: string | null;
  description: string | null;
  images: AsServedImageInput[];
};

export default defineComponent({
  name: 'EditAsServedSetForm',

  components: { AsServedImages },

  mixins: [formMixin],

  setup(props) {
    const loadCallback = (data: AsServedSetEntry) => {
      const { images, ...rest } = data;
      return { ...rest, images: images.map(({ id, weight }) => ({ id, weight })) };
    };

    const { entry, entryLoaded } = useEntry<AsServedSetEntry>(props);
    useEntryFetch(props);
    const { clearError, form, nonInputErrors, routeLeave, submit } = useEntryForm<
      EditAsServedSetForm,
      AsServedSetEntry
    >(props, {
      data: { id: null, description: null, images: [] },
      loadCallback,
      nonInputErrorKeys: ['images'],
    });

    return { entry, entryLoaded, clearError, form, nonInputErrors, routeLeave, submit };
  },

  methods: {
    updateImages(images: AsServedImageInput[]) {
      this.form.errors.clear('images');

      this.form.images = [...images];
    },
  },
});
</script>

<style lang="scss"></style>
