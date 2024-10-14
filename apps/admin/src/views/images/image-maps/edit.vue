<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data.id"
                disabled
                :error-messages="errors.get('id')"
                hide-details="auto"
                :label="$t('image-maps.id')"
                name="id"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
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
        </v-card-text>
        <guide-drawer
          v-bind="{ entry, resource: 'image-maps' }"
          @image-map-objects="updateObjects"
        />
        <error-list :errors="nonInputErrors" tag="v-card-text" />
        <v-card-text>
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

import GuideDrawer from '../guide-drawer.vue';

type EditImageMapForm = {
  id: string | null;
  description: string | null;
  objects: ImageMapEntryObject[];
};

export default defineComponent({
  name: 'EditImageMapForm',

  components: { GuideDrawer },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<ImageMapEntry>(props);
    useEntryFetch(props);
    const { clearError, form: { data, errors }, nonInputErrors, routeLeave, submit } = useEntryForm<
      EditImageMapForm,
      ImageMapEntry
    >(props, {
      data: { id: null, description: null, objects: [] },
      nonInputErrorKeys: ['objects'],
    });

    function updateObjects(objects: ImageMapEntryObject[]) {
      errors.clear('objects');

      data.value.objects = [...objects];
    };

    return { entry, entryLoaded, clearError, data, errors, nonInputErrors, routeLeave, submit, updateObjects };
  },
});
</script>

<style lang="scss"></style>
