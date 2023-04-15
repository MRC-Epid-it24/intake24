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
                :label="$t('image-maps.id')"
                name="id"
                outlined
              ></v-text-field>
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
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <guide-drawer :entry="entry" @image-map-objects="updateObjects"></guide-drawer>
        <error-list :errors="nonInputErrors" tag="v-card-text"></error-list>
        <v-card-text>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ImageMapEntry, ImageMapEntryObject } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { createForm } from '@intake24/admin/util';

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
    const { entry, entryLoaded } = useStoreEntry<ImageMapEntry>(props);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: createForm<EditImageMapForm>({
        id: null,
        description: null,
        objects: [],
      }),
      nonInputErrorKeys: ['objects'],
    };
  },

  methods: {
    updateObjects(objects: ImageMapEntryObject[]) {
      this.form.errors.clear('objects');

      this.form.objects = [...objects];
    },
  },
});
</script>

<style lang="scss"></style>
