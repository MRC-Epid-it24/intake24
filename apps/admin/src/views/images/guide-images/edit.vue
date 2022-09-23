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
                :label="$t('guide-images.id')"
                name="id"
                outlined
                prepend-inner-icon="$guide-images"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.imageMapId"
                disabled
                :error-messages="form.errors.get('imageMapId')"
                hide-details="auto"
                :label="$t('image-maps._')"
                name="imageMapId"
                outlined
                prepend-inner-icon="$image-maps"
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
        <guide-drawer :entry="entry" @guide-image-objects="updateObjects"></guide-drawer>
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

import type { GuideImageEntry, GuideImageEntryObject } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';

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
    const { entry, entryLoaded } = useStoreEntry<GuideImageEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: form<EditGuideImageForm>({
        id: null,
        imageMapId: null,
        description: null,
        objects: [],
      }),
      nonInputErrorKeys: ['objects'],
    };
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
