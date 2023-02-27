<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        class="ml-3"
        color="primary"
        :title="$t(`${resource}.copy._`)"
        v-on="on"
      >
        <v-icon left>fa-copy</v-icon> {{ $t(`${resource}.copy._`) }}
      </v-btn>
    </template>
    <v-card :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="primary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="cancel">
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
              hide-details="auto"
              :label="$t(`${resource}.copy.name`)"
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
        <v-btn class="font-weight-bold" color="info" text @click.stop="confirm">
          <v-icon left>$success</v-icon> {{ $t(`${resource}.copy._`) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { SurveySchemeEntry } from '@intake24/common/types/http/admin';
import { form } from '@intake24/admin/helpers';

export type CopySchemeForm = {
  name: string | null;
};

export default defineComponent({
  name: 'CopySchemeDialog',

  props: {
    resource: {
      type: String as () => 'survey-schemes' | 'feedback-schemes',
      required: true,
    },
    schemeId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      form: form<CopySchemeForm>({ name: null }),
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
      const { resource, schemeId } = this;
      const { name } = this.$route;
      const { id } = await this.form.post<SurveySchemeEntry>(`admin/${resource}/${schemeId}/copy`);

      this.close();

      if (this.redirect)
        await this.$router.push({ name: name ?? `${resource}-read`, params: { id } });
    },
  },
});
</script>
