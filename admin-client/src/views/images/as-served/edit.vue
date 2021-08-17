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
                :label="$t('as-served.id')"
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
      <as-served-images
        :setId="entry.id"
        :items="entry.images"
        @images="updateImages"
      ></as-served-images>
      <v-card-text>
        <submit-footer :disabled="form.errors.any()"></submit-footer>
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { AsServedSetEntry, AsServedImageInput } from '@common/types/http/admin';
import { FormMixin } from '@/types';
import formMixin from '@/components/entry/formMixin';
import form from '@/helpers/Form';
import AsServedImages from './images.vue';

type EditAsServedSetForm = {
  id: string | null;
  description: string | null;
  images: AsServedImageInput[];
};

export default (Vue as VueConstructor<Vue & FormMixin<AsServedSetEntry>>).extend({
  name: 'EditAsServedSetForm',

  components: { AsServedImages },

  mixins: [formMixin],

  data() {
    return {
      form: form<EditAsServedSetForm>({
        id: null,
        description: null,
        images: [],
      }),
      nonInputErrorKeys: ['images'],
    };
  },

  methods: {
    toForm(data: AsServedSetEntry) {
      const { images, ...rest } = data;
      const input = { ...rest, images: images.map(({ id, weight }) => ({ id, weight })) };

      this.setOriginalEntry(input);
      this.form.load(input);
    },

    updateImages(images: AsServedImageInput[]) {
      this.form.errors.clear('images');

      this.form.images = [...images];
    },
  },
});
</script>

<style lang="scss"></style>
