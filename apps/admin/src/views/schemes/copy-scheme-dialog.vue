<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" :title="$t('schemes.copy._')" class="ml-3" color="primary">
        <v-icon left>fa-copy</v-icon> {{ $t('schemes.copy._') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>{{ $t('schemes.copy.title') }}</v-card-title>
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.id"
              :error-messages="form.errors.get('id')"
              :label="$t('schemes.copy.id')"
              hide-details="auto"
              name="id"
              outlined
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.name"
              :error-messages="form.errors.get('name')"
              :label="$t('schemes.copy.name')"
              hide-details="auto"
              name="name"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-checkbox v-model="redirect" :label="$t('common.redirect')"></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-btn class="font-weight-bold" color="error" text @click.stop="cancel">
          <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="font-weight-bold" color="blue darken-3" text @click.stop="confirm">
          <v-icon left>$success</v-icon> {{ $t('schemes.copy._') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { CopySchemeResponse } from '@common/types/http/admin';
import form from '@/helpers/Form';

export type CopySchemeForm = {
  sourceId: string;
  id: string | null;
  name: string | null;
};

export default Vue.extend({
  name: 'CopySchemeDialog',

  props: {
    schemeId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      form: form<CopySchemeForm>({
        sourceId: this.schemeId,
        id: null,
        name: null,
      }),
      dialog: false,
      redirect: true,
    };
  },

  methods: {
    close() {
      this.dialog = false;
    },

    cancel() {
      this.close();
    },

    async confirm() {
      const { name } = this.$route;
      const {
        data: { id },
      } = await this.form.post<CopySchemeResponse>('admin/schemes/copy');

      this.close();

      if (this.redirect) this.$router.push({ name: name ?? 'schemes-detail', params: { id } });
    },
  },
});
</script>
