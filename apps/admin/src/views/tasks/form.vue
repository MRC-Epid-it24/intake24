<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <template v-slot:actions>
      <confirm-dialog
        v-if="!isCreate && can({ action: 'edit' })"
        :label="$t('tasks.run._')"
        :activatorClass="['ml-2']"
        color="secondary"
        iconLeft="fas fa-play"
        @confirm="triggerJob"
      >
        {{ $t('tasks.run.confirm') }}
      </confirm-dialog>
    </template>
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
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
                @change="jobChanged"
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
              >
                <template v-slot:append>
                  <pre>{{ readableCron }}</pre>
                </template>
              </v-text-field>
            </v-col>
            <v-col v-if="form.active" cols="12" md="6">
              <div class="d-flex align-center" style="height: 100%">
                <span v-if="entry.bullJob" class="subtitle-1">
                  {{ $t('tasks.run.next') }}: {{ formatDate(new Date(entry.bullJob.next)) }}
                </span>
              </div>
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
          <component
            v-if="Object.keys(form.params).length"
            :is="form.job"
            v-bind.sync="form.params"
            :refs="refs"
          ></component>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import cronstrue from 'cronstrue';
import { JobParams, JobParamsList, JobType } from '@intake24/common/types';
import { TaskEntry, TaskRefs } from '@intake24/common/types/http/admin';
import { ConfirmDialog } from '@intake24/ui';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';
import FormatsDateTime from '@intake24/admin/mixins/formats-date-time';
import { FormMixin } from '@intake24/admin/types';
import paramComponents from './params';

type TaskForm = {
  id: string | null;
  name: string | null;
  job: JobType | null;
  cron: string | null;
  active: boolean;
  description: string | null;
  params: JobParams;
};

const defaultParams: JobParamsList = {
  CleanRedisStore: { store: 'cache' },
  CleanStorageFiles: {},
  PurgeRefreshTokens: {},
  NutrientTableImportMapping: {
    nutrientTableId: '',
    file: '',
  },
  NutrientTableImportData: {
    nutrientTableId: '',
    file: '',
  },
  SendPasswordReset: {
    email: '',
    token: '',
  },
  SurveyDataExport: {
    surveyId: '',
  },
  SurveyExportRespondentAuthUrls: {
    surveyId: '',
  },
  SurveyImportRespondents: {
    surveyId: '',
    file: '',
  },
  SurveySubmissionNotification: {
    surveyId: '',
    submissionId: '',
  },
};

export default (Vue as VueConstructor<Vue & FormMixin<TaskEntry, TaskRefs>>).extend({
  name: 'TaskForm',

  components: { ConfirmDialog, ...paramComponents },

  mixins: [FormatsDateTime, formMixin],

  data() {
    return {
      form: form<TaskForm>({
        id: null,
        name: null,
        job: null,
        cron: '0 * * * *',
        active: false,
        description: null,
        params: {},
      }),
      defaultParams,
    };
  },

  computed: {
    readableCron(): string {
      if (!this.form.cron) return '';

      try {
        return cronstrue.toString(this.form.cron, { use24HourTimeFormat: true });
      } catch (err) {
        return this.$t('tasks.invalidCron').toString();
      }
    },
  },

  methods: {
    toForm(data: TaskEntry) {
      const { params, ...rest } = data;
      const input = { ...rest, params: { ...defaultParams[rest.job], ...params } };

      this.setOriginalEntry(input);
      this.form.load(input);
    },

    jobChanged() {
      this.form.errors.clear('job');
      this.updateParams();
    },

    updateParams() {
      if (!this.form.job) {
        this.form.params = {};
        return;
      }

      this.form.params = { ...this.defaultParams[this.form.job] };
    },

    async triggerJob() {
      await this.$http.post(`admin/tasks/${this.id}/run`);
    },
  },
});
</script>

<style scoped></style>
