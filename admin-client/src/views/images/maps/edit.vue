<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :error-messages="form.errors.get('id')"
                :label="$t('image-maps.id')"
                disabled
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                :label="$t('common.description')"
                hide-details="auto"
                name="description"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <guide-drawer :entry="entry" @image-map-objects="updateObjects"></guide-drawer>
      <v-card-text v-if="nonInputErrors.length">
        <v-alert
          v-for="error in nonInputErrors"
          :key="error.param"
          outlined
          type="error"
          prominent
          border="left"
        >
          {{ error.msg }}
        </v-alert>
      </v-card-text>
      <v-card-text>
        <submit-footer :disabled="form.errors.any()"></submit-footer>
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { ImageMapEntry, ImageMapEntryObject } from '@common/types/http/admin';
import { FormMixin } from '@/types';
import formMixin from '@/components/entry/formMixin';
import form from '@/helpers/Form';
import GuideDrawer from '../guide-drawer.vue';

type EditImageMapForm = {
  id: string | null;
  description: string | null;
  objects: ImageMapEntryObject[];
};

export default (Vue as VueConstructor<Vue & FormMixin<ImageMapEntry>>).extend({
  name: 'EditImageMapForm',

  components: { GuideDrawer },

  mixins: [formMixin],

  data() {
    return {
      form: form<EditImageMapForm>({
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
