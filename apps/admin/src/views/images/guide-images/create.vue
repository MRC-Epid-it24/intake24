<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :error-messages="form.errors.get('id')"
                hide-details="auto"
                :label="$t('guide-images.id')"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <select-resource
                v-model="form.imageMapId"
                item-name="id"
                resource="image-maps"
                @input="form.errors.clear('imageMapId')"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-bind="attrs"
                    clearable
                    :error-messages="form.errors.get('imageMapId')"
                    hide-details="auto"
                    :label="$t('image-maps.id')"
                    name="imageMapId"
                    outlined
                    readonly
                    :value="form.imageMapId"
                    v-on="on"
                  >
                  </v-text-field>
                </template>
              </select-resource>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                hide-details="auto"
                :label="$t('common.description')"
                name="description"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { GuideImageEntry } from '@intake24/common/types/http/admin';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';

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
    const { entry, entryLoaded } = useStoreEntry<GuideImageEntry>(props.id);

    return { entry, entryLoaded };
  },

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
