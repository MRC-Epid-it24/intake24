<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-title>{{ $t('surveys.data-export.title') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
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
                    <v-date-picker
                      v-model="form.startDate"
                      scrollable
                      @change="form.errors.clear('startDate')"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menus.startDate = false">
                        {{ $t('common.action.cancel') }}
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.startDate.save(form.startDate)">
                        {{ $t('common.action.ok') }}
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
                    <v-date-picker
                      v-model="form.endDate"
                      scrollable
                      @change="form.errors.clear('endDate')"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menus.endDate = false">
                        {{ $t('common.action.cancel') }}
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.endDate.save(form.endDate)">
                        {{ $t('common.action.ok') }}
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    :disabled="form.errors.any() || isAppLoading"
                    x-large
                    type="submit"
                    block
                    color="secondary"
                    :title="$t('common.action.export')"
                  >
                    <v-icon left>fa-download</v-icon> {{ $t('common.action.export') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <polls-job-list v-bind="{ jobs }" @download="download"></polls-job-list>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { JobEntry, SurveyEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { PollsForJobs } from '@intake24/admin/components/jobs';
import { form } from '@intake24/admin/helpers';

type SurveyDataExportForm = {
  startDate: string | null;
  endDate: string | null;
};

export default defineComponent({
  name: 'SurveyDataExport',

  mixins: [detailMixin, PollsForJobs],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<SurveyEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      menus: { startDate: false, endDate: false },
      form: form<SurveyDataExportForm>(
        {
          startDate: null,
          endDate: null,
        },
        { resetOnSubmit: false }
      ),
      jobType: 'SurveyDataExport',
    };
  },

  watch: {
    entry(val) {
      if (Object.keys(val).length) this.form.load(val);
    },
  },

  async mounted() {
    await this.startPolling(true);
  },

  methods: {
    async submit() {
      if (this.jobInProgress) return;

      const job = await this.form.post<JobEntry>(`admin/surveys/${this.id}/data-export`);

      this.jobs.unshift(job);
      this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
