<template>
  <layout :id="id" :entry="entry" @save="onSubmit" v-if="entryLoaded">
    <v-form @keydown.native="clearError" @submit.prevent="onSubmit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :error-messages="form.errors.get('id')"
                :label="$t('guide-images.id')"
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
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-container>
    </v-form>
    <guide-drawer :entry="entry"></guide-drawer>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { FormMixin } from '@/types/vue';
import formMixin from '@/components/entry/formMixin';
import form from '@/helpers/Form';
import { GuideImageEntry, GuideImageEntryObject } from '@common/types/http/admin';
import GuideDrawer from '../GuideDrawer.vue';

type EditGuideImageForm = {
  id: number | null;
  description: string | null;
  objects: GuideImageEntryObject[];
};

export default (Vue as VueConstructor<Vue & FormMixin<GuideImageEntry>>).extend({
  name: 'EditGuideImageForm',

  components: { GuideDrawer },

  mixins: [formMixin],

  data() {
    return {
      form: form<EditGuideImageForm>({
        id: null,
        description: null,
        objects: [],
      }),
    };
  },
});
</script>

<style lang="scss"></style>
