<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item key="respondentsUpload" v-bind="attrs" v-on="on" link>
        <v-list-item-title>
          <v-icon class="mr-2">fa-upload</v-icon>
          {{ $t('surveys.respondents.upload._') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ $t(`surveys.respondents.upload.title`) }}</span>
      </v-card-title>
      <v-form ref="form" @submit.prevent="submit">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm>
                <v-file-input
                  v-model="form.file"
                  :error-messages="form.errors.get('file')"
                  :label="$t('surveys.respondents.upload.file')"
                  hide-details="auto"
                  name="file"
                  outlined
                  prepend-icon="fa-file-excel"
                  @input="form.errors.clear('file')"
                ></v-file-input>
              </v-col>
              <v-col cols="12" sm="auto">
                <v-btn type="submit" color="secondary" x-large block :disabled="jobInProgress">
                  <v-icon class="mr-2">fa-upload</v-icon>
                  {{ $t('surveys.respondents.upload.submit') }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-list two-line>
                  <v-list-item v-for="item in jobs" :key="item.id">
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
                      <!-- <v-list-item-subtitle></v-list-item-subtitle> -->
                      <p v-if="item.message">{{ item.message }}</p>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-progress-circular
                        indeterminate
                        color="secondary"
                        v-if="item.progress != 1"
                      ></v-progress-circular>
                      <template v-else>
                        <v-icon v-if="item.successful" color="success" large>
                          fa-check-circle
                        </v-icon>
                        <v-icon v-if="!item.successful" color="error" large>fa-times-circle</v-icon>
                      </template>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="font-weight-bold" color="blue darken-3" text @click.stop="close">
            {{ $t('common.action.close') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { JobResponse } from '@common/types/http/admin';
import form from '@/helpers/Form';
import RespondentsJobMixin from './RespondentsJobMixin';

type mixins = InstanceType<typeof RespondentsJobMixin>;

type RespondentsUploadForm = {
  file: File | null;
};

export default (Vue as VueConstructor<Vue & mixins>).extend({
  name: 'RespondentsUpload',

  mixins: [RespondentsJobMixin],

  data() {
    return {
      form: form<RespondentsUploadForm>({ file: null }, { multipart: true }),
      jobType: 'SurveyImportRespondents',
    };
  },

  methods: {
    close() {
      this.form.reset();
      this.dialog = false;
      this.$emit('list:update');
    },

    async submit() {
      if (this.jobInProgress) return;

      const { data } = await this.form.post<JobResponse>(
        `admin/surveys/${this.surveyId}/respondents/upload`
      );

      this.jobs.unshift(data);
      this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
