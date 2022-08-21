<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <embedded-data-table ref="table" :headers="headers" :api="baseAPI">
      <template #[`item.startTime`]="{ item }">
        {{ formatDate(item.startTime) }}
      </template>
      <template #[`item.endTime`]="{ item }">
        {{ formatDate(item.endTime) }}
      </template>
      <template #[`item.action`]="{ item }">
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
    </embedded-data-table>
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
import { defineComponent, ref } from 'vue';

import type { SurveyEntry, SurveySubmissionEntry } from '@intake24/common/types/http/admin';
import { EmbeddedDataTable } from '@intake24/admin/components/data-tables';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { formatsDateTime } from '@intake24/admin/mixins';
import { ConfirmDialog } from '@intake24/ui';
import { useMessages } from '@intake24/ui/stores';

export type SurveySubmissionsRefs = {
  $refs: {
    table: InstanceType<typeof EmbeddedDataTable>;
  };
};

export default defineComponent({
  name: 'SurveySubmissions',

  components: { ConfirmDialog, EmbeddedDataTable },

  mixins: [detailMixin, formatsDateTime],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<SurveyEntry>(props.id);

    const table = ref<InstanceType<typeof EmbeddedDataTable>>();

    return { entry, entryLoaded, refs, refsLoaded, table };
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
