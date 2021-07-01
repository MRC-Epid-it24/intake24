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
                :label="$t('as-served.id')"
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input
                v-model="form.selectionImage"
                :error-messages="form.errors.get('selectionImage')"
                :label="$t('as-served.selectionImage')"
                hide-details="auto"
                name="selectionImage"
                outlined
                @change="form.errors.clear('selectionImage')"
              ></v-file-input>
            </v-col>
            <v-col cols="12">
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
import { AsServedSetEntry } from '@common/types/http/admin';

type CreateAsServedSetForm = {
  id: string | null;
  description: string | null;
  selectionImage: File | null;
};

export default (Vue as VueConstructor<Vue & FormMixin<AsServedSetEntry>>).extend({
  name: 'CreateAsServedSetForm',

  mixins: [formMixin],

  data() {
    return {
      form: form<CreateAsServedSetForm>(
        {
          id: null,
          description: null,
          selectionImage: null,
        },
        { multipart: true }
      ),
    };
  },
});
</script>

<style lang="scss"></style>
