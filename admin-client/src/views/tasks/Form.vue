<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :disabled="isEdit"
                :error-messages="form.errors.get('name')"
                :label="$t('common.name')"
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.job"
                :items="refs.jobs"
                :error-messages="form.errors.get('job')"
                :label="$t('tasks.job')"
                hide-details="auto"
                name="job"
                outlined
                @change="form.errors.clear('job')"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.cron"
                :error-messages="form.errors.get('cron')"
                :label="$t('tasks.cron')"
                hide-details="auto"
                name="cron"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.active"
                :error-messages="form.errors.get('active')"
                :label="$t('common.action.active')"
                hide-details="auto"
                name="active"
              ></v-switch>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                :label="$t('common.description')"
                hide-details="auto"
                name="description"
                outlined
              ></v-textarea>
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

type TaskForm = {
  id: number | null;
  name: string | null;
  job: string | null;
  cron: string;
  active: boolean;
  description: string | null;
};

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'TaskForm',

  mixins: [formMixin],

  data() {
    return {
      form: form<TaskForm>({
        id: null,
        name: null,
        job: null,
        cron: '0 * * * *',
        active: false,
        description: null,
      }),
    };
  },
});
</script>

<style scoped></style>
