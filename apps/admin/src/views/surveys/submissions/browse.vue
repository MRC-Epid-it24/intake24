<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <data-table :headers="headers" :api="baseAPI" ref="table">
      <template v-slot:[`item.startTime`]="{ item }">
        {{ formatDate(item.startTime) }}
      </template>
      <template v-slot:[`item.endTime`]="{ item }">
        {{ formatDate(item.endTime) }}
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-btn :title="$t('common.action.read')" color="primary" icon @click.stop="detail(item.id)">
          <v-icon>$read</v-icon>
        </v-btn>
        <confirm-dialog
          :label="$t('common.action.delete')"
          color="error"
          icon
          icon-left="$delete"
          @confirm="remove(item.id)"
        >
          {{ $t('common.action.confirm.delete', { name: item.id }) }}
        </confirm-dialog>
      </template>
    </data-table>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card tile>
        <v-toolbar dark color="primary">
          <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="close">
            <v-icon>$cancel</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ selected.id }}
          </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <pre>{{ JSON.stringify(selected, null, '\t') }}</pre>
        </v-container>
      </v-card>
    </v-dialog>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { SurveySubmissionEntry } from '@common/types/http/admin';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import detailMixin from '@/components/entry/detailMixin';
import { EntryMixin } from '@/types';
import FormatsDateTime from '@/mixins/FormatsDateTime';
import DataTable from '../data-table.vue';

export type SurveySubmissionsRefs = {
  $refs: {
    table: InstanceType<typeof DataTable>;
  };
};

export default (Vue as VueConstructor<Vue & EntryMixin & SurveySubmissionsRefs>).extend({
  name: 'SurveySubmissions',

  components: { ConfirmDialog, DataTable },

  mixins: [detailMixin, FormatsDateTime],

  data() {
    return {
      headers: [
        {
          text: this.$t('surveys.submissions.id'),
          sortable: true,
          value: 'id',
          align: 'start',
        },
        {
          text: this.$t('surveys.submissions.userId'),
          sortable: true,
          value: 'userId',
          align: 'start',
        },
        {
          text: this.$t('surveys.submissions.startTime'),
          sortable: true,
          value: 'startTime',
          align: 'start',
        },
        {
          text: this.$t('surveys.submissions.endTime'),
          sortable: true,
          value: 'endTime',
          align: 'start',
        },
        {
          text: this.$t('common.action._'),
          sortable: false,
          value: 'action',
          align: 'right',
        },
      ],
      dialog: false,
      selected: {} as SurveySubmissionEntry,
    };
  },

  computed: {
    baseAPI(): string {
      return `admin/surveys/${this.id}/submissions`;
    },
    isSelected(): boolean {
      return !Object.keys(this.selected).length;
    },
  },

  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },

    async detail(submissionId: string) {
      const { data } = await this.$http.get<SurveySubmissionEntry>(
        `${this.baseAPI}/${submissionId}`
      );

      this.selected = data;
      this.open();
    },

    async remove(submissionId: string) {
      await this.$http.delete(`${this.baseAPI}/${submissionId}`);
      this.$toasted.success(this.$t(`common.msg.deleted`, { name: submissionId }).toString());
      await this.$refs.table.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
