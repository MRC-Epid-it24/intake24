<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
    <v-form @keydown.native="clearError" @submit.prevent="onSubmit">
      <v-container>
        <v-card-title>Data Export settings</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <v-dialog
                    ref="startDate"
                    v-model="menus.startDate"
                    :return-value.sync="form.startDate"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.startDate"
                        :error-messages="form.errors.get('startDate')"
                        :label="$t('surveys.startDate')"
                        hide-details="auto"
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="form.startDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menus.startDate = false">Cancel</v-btn>
                      <v-btn text color="primary" @click="$refs.startDate.save(form.startDate)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="12">
                  <v-dialog
                    ref="endDate"
                    v-model="menus.endDate"
                    :return-value.sync="form.endDate"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.endDate"
                        :error-messages="form.errors.get('endDate')"
                        :label="$t('surveys.endDate')"
                        hide-details="auto"
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="form.endDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menus.endDate = false">Cancel</v-btn>
                      <v-btn text color="primary" @click="$refs.endDate.save(form.endDate)"
                        >OK</v-btn
                      >
                    </v-date-picker>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    :disabled="form.errors.any() || isLoading"
                    x-large
                    type="submit"
                    block
                    color="secondary"
                    title="Submit"
                  >
                    <v-icon left>fa-submit</v-icon> Submit
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-list three-line>
                <v-list-item v-for="item in visibleJobs" :key="item.id">
                  <v-list-item-avatar>
                    <v-icon class="grey" dark>fa-running</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.type }}</v-list-item-title>
                    <v-list-item-subtitle>
                      Started: {{ new Date(item.startedAt).toLocaleString() }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      Completed:
                      {{ item.completedAt ? new Date(item.completedAt).toLocaleString() : '' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      v-if="item.downloadUrl"
                      :title="$t('common.action.download')"
                      icon
                      link
                      @click="download(item.id)"
                    >
                      <v-icon color="primary">fa-download</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-progress-circular
                      indeterminate
                      color="secondary"
                      v-if="item.progress != 1"
                    ></v-progress-circular>
                    <template v-else>
                      <v-icon v-if="item.successful" color="success" large>fa-check-circle</v-icon>
                      <v-icon v-if="!item.successful" color="error" large>fa-times-circle</v-icon>
                    </template>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { downloadFile } from '@/util/fs';
import formMixin from '@/components/entry/formMixin';
import Form from '@/helpers/Form';
import { FormMixin } from '@/types/vue';
import { JobResponse } from '@common/types/http';
import PollsForJobsMixin from './PollsForJobsMixin';

type mixins = InstanceType<typeof PollsForJobsMixin>;

export default (Vue as VueConstructor<Vue & FormMixin & mixins>).extend({
  name: 'SurveyDataExport',

  mixins: [formMixin, PollsForJobsMixin],

  data() {
    return {
      menus: { startDate: false, endDate: false },
      form: new Form(
        {
          startDate: null,
          endDate: null,
        },
        { resetOnSubmit: false }
      ),
      jobType: 'SurveyDataExport',
    };
  },

  computed: {},

  async mounted() {
    await this.status();
  },

  methods: {
    async onSubmit() {
      if (this.jobInProgress) return;

      const { data } = await this.form.post<JobResponse>(`admin/surveys/${this.id}/data-export`);

      this.jobs.unshift(data);
      this.startPolling();
    },

    async download(id: number) {
      const res = await this.$http.get(`admin/jobs/${id}/download`, { responseType: 'blob' });
      downloadFile(res);
    },
  },
});
</script>

<style lang="scss" scoped></style>
