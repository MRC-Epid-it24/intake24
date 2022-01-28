<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        :title="$t(`${resource}.copy._`)"
        class="ml-3"
        color="primary"
      >
        <v-icon left>fa-copy</v-icon> {{ $t(`${resource}.copy._`) }}
      </v-btn>
    </template>
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`${resource}.copy.title`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.name"
              :error-messages="form.errors.get('name')"
              :label="$t(`${resource}.copy.name`)"
              hide-details="auto"
              name="name"
              outlined
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="12">
            <v-checkbox v-model="redirect" :label="$t('common.redirect')"></v-checkbox>
          </v-col> -->
        </v-row>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-btn class="font-weight-bold" color="error" text @click.stop="cancel">
          <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="font-weight-bold" color="blue darken-3" text @click.stop="confirm">
          <v-icon left>$success</v-icon> {{ $t(`${resource}.copy._`) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { SurveySchemeEntry } from '@intake24/common/types/http/admin';
import { form } from '@intake24/admin/helpers';

export type CopySchemeForm = {
  sourceId: string;
  name: string | null;
};

export default Vue.extend({
  name: 'CopySchemeDialog',

  props: {
    resource: {
      type: String as () => 'survey-scheme' | 'feedback-scheme',
      required: true,
    },
    schemeId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      form: form<CopySchemeForm>({
        sourceId: this.schemeId,
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
      const { resource } = this;
      const { name } = this.$route;
      const { id } = await this.form.post<SurveySchemeEntry>(`admin/${resource}/copy`);

      this.close();

      if (this.redirect) this.$router.push({ name: name ?? `${resource}-read`, params: { id } });
    },
  },
});
</script>
