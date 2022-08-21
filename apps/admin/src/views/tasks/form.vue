<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <template #actions>
      <confirm-dialog
        v-if="!isCreate && can({ action: 'edit' })"
        :label="$t('tasks.run._').toString()"
        :activator-class="['ml-2']"
        color="secondary"
        icon-left="fas fa-play"
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
                :items="jobs"
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
                <template #append>
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
            :is="form.job"
            v-if="Object.keys(form.params).length"
            v-model="form.params"
            :error="form.errors.get('params')"
            :refs="refs"
            name="params"
            @input="form.errors.clear('params')"
          ></component>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import cronstrue from 'cronstrue';
import { defineComponent } from 'vue';

import type { JobType, JobTypeParams } from '@intake24/common/types';
import type { TaskEntry, TaskRefs } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { jobParams } from '@intake24/admin/components/jobs';
import { form } from '@intake24/admin/helpers';
import { formatsDateTime } from '@intake24/admin/mixins';
import { defaultJobsParams } from '@intake24/common/types';
import { ConfirmDialog } from '@intake24/ui';

type TaskForm = {
  id: string | null;
  name: string | null;
  job: JobType | null;
  cron: string | null;
  active: boolean;
  description: string | null;
  params: JobTypeParams;
};

export default defineComponent({
  name: 'TaskForm',

  components: { ConfirmDialog, ...jobParams },

  mixins: [formatsDateTime, formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<TaskEntry, TaskRefs>(props.id);

    return { entry, entryLoaded, refs, refsLoaded };
  },

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
      defaultJobsParams,
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

    jobs(): { text: string; value: string }[] {
      if (!this.refsLoaded) return [];

      return this.refs.jobs.map((value) => ({
        value,
        text: this.$t(`jobs.types.${value}._`).toString(),
      }));
    },
  },

  methods: {
    toForm(data: TaskEntry) {
      const { params, ...rest } = data;
      const input = { ...rest, params: { ...defaultJobsParams[rest.job], ...params } };

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

      this.form.params = { ...this.defaultJobsParams[this.form.job] };
    },

    async triggerJob() {
      await this.$http.post(`admin/tasks/${this.id}/run`);
    },
  },
});
</script>

<style scoped></style>
