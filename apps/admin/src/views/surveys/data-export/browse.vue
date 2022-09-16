<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-container fluid>
      <v-form @submit.prevent="submit">
        <v-card-title>{{ $t('surveys.data-export.title') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-dialog
                    ref="startDate"
                    v-model="menus.startDate"
                    persistent
                    :return-value.sync="form.startDate"
                    width="290px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.startDate"
                        :error-messages="form.errors.get('startDate')"
                        hide-details="auto"
                        :label="$t('surveys.startDate')"
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
                      <v-btn color="primary" text @click="menus.startDate = false">
                        {{ $t('common.action.cancel') }}
                      </v-btn>
                      <v-btn color="primary" text @click="$refs.startDate.save(form.startDate)">
                        {{ $t('common.action.ok') }}
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="12">
                  <v-dialog
                    ref="endDate"
                    v-model="menus.endDate"
                    persistent
                    :return-value.sync="form.endDate"
                    width="290px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.endDate"
                        :error-messages="form.errors.get('endDate')"
                        hide-details="auto"
                        :label="$t('surveys.endDate')"
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
                      <v-btn color="primary" text @click="menus.endDate = false">
                        {{ $t('common.action.cancel') }}
                      </v-btn>
                      <v-btn color="primary" text @click="$refs.endDate.save(form.endDate)">
                        {{ $t('common.action.ok') }}
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    block
                    color="secondary"
                    :disabled="form.errors.any() || isAppLoading"
                    :title="$t('common.action.export')"
                    type="submit"
                    x-large
                  >
                    <v-icon left>fa-download</v-icon> {{ $t('common.action.export') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <polls-job-list v-bind="{ jobs }"></polls-job-list>
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
