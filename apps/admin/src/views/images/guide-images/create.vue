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
                :label="$t('guide-images.id')"
                name="id"
                prepend-inner-icon="$guide-images"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <select-resource
                v-model="form.imageMapId"
                clearable
                :error-messages="form.errors.get('imageMapId')"
                item-name="description"
                :label="$t('image-maps.id')"
                name="imageMapId"
                resource="image-maps"
                @update:model-value="form.errors.clear('imageMapId')"
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
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { GuideImageEntry } from '@intake24/common/types/http/admin';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

type CreateGuideImageForm = {
  id: string | null;
  imageMapId: string | null;
  description: string | null;
};

export default defineComponent({
  name: 'CreateGuideImageForm',

  components: { SelectResource },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<GuideImageEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      CreateGuideImageForm,
      GuideImageEntry
    >(props, {
      data: { id: null, description: null, imageMapId: null },
    });

    return { entry, entryLoaded, clearError, form, routeLeave, submit };
  },
});
</script>

<style lang="scss"></style>
