<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <template #actions>
      <confirm-dialog
        v-if="!isCreate && can({ action: 'edit' })"
        :activator-class="['ml-2']"
        color="primary"
        icon-left="fas fa-play"
        :label="$t('tasks.run._').toString()"
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
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('common.name')"
                name="name"
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.job"
                :error-messages="form.errors.get('job')"
                hide-details="auto"
                :items="jobs"
                :label="$t('tasks.job')"
                name="job"
                outlined
                prepend-inner-icon="$jobs"
                @change="jobChanged"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.cron"
                :error-messages="form.errors.get('cron')"
                hide-details="auto"
                :label="$t('tasks.cron')"
                name="cron"
                outlined
                prepend-inner-icon="far fa-clock"
              >
                <template #append>
                  <pre>{{ readableCron }}</pre>
                </template>
              </v-text-field>
            </v-col>
            <v-col v-if="form.active" cols="12" md="6">
              <div class="d-flex align-center" style="height: 100%">
                <span v-if="entry.bullJob" class="subtitle-1">
                  {{ $t('tasks.run.next') }}: {{ formatDateTime(new Date(entry.bullJob.next)) }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.active"
                :error-messages="form.errors.get('active')"
                hide-details="auto"
                :label="$t('common.action.active')"
                name="active"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                hide-details="auto"
                :label="$t('common.description')"
                name="description"
                outlined
                prepend-inner-icon="$description"
              />
            </v-col>
          </v-row>
          <component
            :is="form.job"
            v-if="Object.keys(form.params).length"
            v-model="form.params"
            :errors="form.errors"
            name="params"
            @input="form.errors.clear(paramErrors)"
          />
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import cronstrue from 'cronstrue';
import { computed, defineComponent } from 'vue';

import type { JobType, JobTypeParams } from '@intake24/common/types';
import type { TaskResponse } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { jobParams } from '@intake24/admin/components/jobs';
import { useDateTime, useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { defaultJobsParams, jobTypes } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui';

type TaskForm = {
  id: string | null;
  name: string | null;
  job: JobType;
  cron: string | null;
  active: boolean;
  description: string | null;
  params: JobTypeParams;
};

export default defineComponent({
  name: 'TaskForm',

  components: { ConfirmDialog, ...jobParams },

  mixins: [formMixin],

  setup(props) {
    const { i18n } = useI18n();

    const loadCallback = (data: TaskResponse) => {
      const { params, ...rest } = data;
      return { ...rest, params: { ...defaultJobsParams[rest.job], ...params } };
    };

    const { formatDateTime } = useDateTime();

    const { entry, entryLoaded, isCreate, isEdit } = useEntry<TaskResponse>(props);
    useEntryFetch(props);

    const jobs = computed(() =>
      jobTypes.map(value => ({ value, text: i18n.t(`jobs.types.${value}._`).toString() })),
    );

    const { clearError, form, routeLeave, submit } = useEntryForm<TaskForm, TaskResponse>(props, {
      data: {
        id: null,
        name: null,
        job: 'CleanRedisStore',
        cron: null,
        active: false,
        description: null,
        params: {},
      },
      loadCallback,
    });

    const paramErrors = computed(() => Object.keys(form.params).map(key => `params.${key}`));

    return {
      defaultJobsParams,
      entry,
      entryLoaded,
      formatDateTime,
      isCreate,
      isEdit,
      jobs,
      paramErrors,
      clearError,
      form,
      routeLeave,
      submit,
    };
  },

  computed: {
    readableCron(): string {
      if (!this.form.cron)
        return '';

      try {
        return cronstrue.toString(this.form.cron, { use24HourTimeFormat: true });
      }
      catch (err) {
        return this.$t('tasks.invalidCron').toString();
      }
    },
  },

  methods: {
    jobChanged() {
      this.form.errors.clear('job');
      this.updateParams();
    },

    updateParams() {
      if (!this.form.job) {
        this.form.params = {};
        return;
      }

      this.form.params = { ...this.defaultJobsParams[this.form.job] };
    },

    async triggerJob() {
      await this.$http.post(`admin/tasks/${this.id}/run`);
    },
  },
});
</script>

<style scoped></style>
