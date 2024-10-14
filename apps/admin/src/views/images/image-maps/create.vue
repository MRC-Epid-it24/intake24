<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data.id"
                :error-messages="errors.get('id')"
                hide-details="auto"
                :label="$t('image-maps.id')"
                name="id"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input
                v-model="data.baseImage"
                :error-messages="errors.get('baseImage')"
                hide-details="auto"
                :label="$t('image-maps.baseImage')"
                name="baseImage"
                prepend-icon=""
                prepend-inner-icon="fas fa-paperclip"
                variant="outlined"
                @change="errors.clear('baseImage')"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="data.description"
                :error-messages="errors.get('description')"
                hide-details="auto"
                :label="$t('common.description')"
                name="description"
                prepend-inner-icon="$description"
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

import type { ImageMapEntry, ImageMapEntryObject } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

type CreateImageMapForm = {
  id: string | null;
  description: string | null;
  baseImage: File | null;
  objects: ImageMapEntryObject[];
};

export default defineComponent({
  name: 'CreateImageMapForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<ImageMapEntry>(props);
    useEntryFetch(props);
    const { clearError, form: { data, errors }, routeLeave, submit } = useEntryForm<
      CreateImageMapForm,
      ImageMapEntry
    >(props, {
      data: {
        id: null,
        description: null,
        baseImage: null,
        objects: [],
      },
      config: { multipart: true },
    });

    return { entry, entryLoaded, clearError, data, errors, routeLeave, submit };
  },
});
</script>

<style lang="scss"></style>
