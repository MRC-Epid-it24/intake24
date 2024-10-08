<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                disabled
                :error-messages="form.errors.get('id')"
                hide-details="auto"
                :label="$t('guide-images.id')"
                name="id"
                prepend-inner-icon="$guide-images"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.imageMapId"
                disabled
                :error-messages="form.errors.get('imageMapId')"
                hide-details="auto"
                :label="$t('image-maps._')"
                name="imageMapId"
                prepend-inner-icon="$image-maps"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
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
        </v-card-text>
        <guide-drawer
          v-bind="{ entry, resource: 'guide-images' }"
          @guide-image-objects="updateObjects"
        />
        <error-list :errors="nonInputErrors" tag="v-card-text" />
        <v-card-text>
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { GuideImageEntry, GuideImageEntryObject } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

import GuideDrawer from '../guide-drawer.vue';

type EditGuideImageForm = {
  id: string | null;
  imageMapId: string | null;
  description: string | null;
  objects: GuideImageEntryObject[];
};

export default defineComponent({
  name: 'EditGuideImageForm',

  components: { GuideDrawer },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<GuideImageEntry>(props);
    useEntryFetch(props);
    const { clearError, form, nonInputErrors, routeLeave, submit } = useEntryForm<
      EditGuideImageForm,
      GuideImageEntry
    >(props, {
      data: { id: null, imageMapId: null, description: null, objects: [] },
      nonInputErrorKeys: ['objects'],
    });

    return { entry, entryLoaded, clearError, form, nonInputErrors, routeLeave, submit };
  },

  methods: {
    async updateObjects(objects: GuideImageEntryObject[]) {
      this.form.errors.clear('objects');

      this.form.objects = [...objects];
    },
  },
});
</script>

<style lang="scss"></style>
