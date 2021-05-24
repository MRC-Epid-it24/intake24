<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :error-messages="form.errors.get('id')"
                :label="$t('guide-images.id')"
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.imageMapId"
                :items="refs.imageMaps"
                :label="$t('image-maps._')"
                :error-messages="form.errors.get('imageMapId')"
                item-value="id"
                item-text="description"
                hide-details="auto"
                name="imageMapId"
                outlined
                @change="form.errors.clear('imageMapId')"
              >
                <template v-slot:item="{ item }">
                  {{ `${item.id} (${item.description})` }}
                </template>
                <template v-slot:selection="{ item }">
                  {{ `${item.id} (${item.description})` }}
                </template>
              </v-select>
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
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-container>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { FormMixin } from '@/types/vue';
import formMixin from '@/components/entry/formMixin';
import form from '@/helpers/Form';
import { GuideImageEntry } from '@common/types/http/admin';

type CreateGuideImageForm = {
  id: string | null;
  imageMapId: string | null;
  description: string | null;
};

export default (Vue as VueConstructor<Vue & FormMixin<GuideImageEntry>>).extend({
  name: 'CreateGuideImageForm',

  mixins: [formMixin],

  data() {
    return {
      form: form<CreateGuideImageForm>({
        id: null,
        description: null,
        imageMapId: null,
      }),
    };
  },
});
</script>

<style lang="scss"></style>
