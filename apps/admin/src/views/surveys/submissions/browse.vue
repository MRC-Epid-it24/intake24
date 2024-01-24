<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <embedded-data-table ref="table" :api-url="baseAPI" :headers="headers">
      <template #[`item.startTime`]="{ item }">
        {{ formatDateTime(item.startTime) }}
      </template>
      <template #[`item.endTime`]="{ item }">
        {{ formatDateTime(item.endTime) }}
      </template>
      <template #[`item.action`]="{ item }">
        <v-btn
          color="secondary"
          icon
          :title="$t('common.action.read')"
          @click.stop="detail(item.id)"
        >
          <v-icon>$read</v-icon>
        </v-btn>
        <confirm-dialog
          color="error"
          icon
          icon-left="$delete"
          :label="$t('common.action.delete').toString()"
          @confirm="remove(item.id)"
        >
          {{ $t('common.action.confirm.delete', { name: item.id }) }}
        </confirm-dialog>
      </template>
    </embedded-data-table>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card tile>
        <v-toolbar color="secondary" dark>
          <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
            <v-icon>$cancel</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ selected.id }}
          </v-toolbar-title>
        </v-toolbar>
        <v-container fluid>
          <pre>{{ JSON.stringify(selected, null, '\t') }}</pre>
        </v-container>
      </v-card>
    </v-dialog>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { SurveyEntry, SurveySubmissionEntry } from '@intake24/common/types/http/admin';
import { EmbeddedDataTable } from '@intake24/admin/components/data-tables';
import { detailMixin } from '@intake24/admin/components/entry';
import { useDateTime, useEntry, useEntryFetch } from '@intake24/admin/composables';
import { ConfirmDialog } from '@intake24/ui';
import { useMessages } from '@intake24/ui/stores';

export default defineComponent({
  name: 'SurveySubmissions',

  components: { ConfirmDialog, EmbeddedDataTable },

  mixins: [detailMixin],

  setup(props) {
    const { formatDateTime } = useDateTime();

    const { entry, entryLoaded } = useEntry<SurveyEntry>(props);
    useEntryFetch(props);

    const table = ref<InstanceType<typeof EmbeddedDataTable>>();

    return {
      formatDateTime,
      entry,
      entryLoaded,
      table,
    };
  },

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
          text: this.$t('users.aliases.username'),
          sortable: true,
          value: 'username',
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
      useMessages().success(this.$t(`common.msg.deleted`, { name: submissionId }).toString());
      await this.table?.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
