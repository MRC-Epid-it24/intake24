<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <data-table :headers="headers" :api="`admin/surveys/${id}/submissions`" ref="table">
      <template v-slot:[`item.startTime`]="{ item }">
        {{ new Date(item.startTime).toLocaleString() }}
      </template>
      <template v-slot:[`item.endTime`]="{ item }">
        {{ new Date(item.endTime).toLocaleString() }}
      </template>
      <template v-slot:[`item.action`]="{ item }" class="text-right">
        <confirm-dialog
          :label="$t('common.action.delete')"
          color="error"
          icon
          icon-left="$delete"
          @confirm="remove(item)"
        >
          {{ $t('common.action.confirm.delete', { name: item.id }) }}
        </confirm-dialog>
      </template>
    </data-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import detailMixin from '@/components/entry/detailMixin';
import { EntryMixin } from '@/types';
import { SurveySubmissionEntry } from '@common/types/http/admin';
import DataTable from '../data-table.vue';

export type SurveySubmissionsRefs = {
  $refs: {
    table: InstanceType<typeof DataTable>;
  };
};

export default (Vue as VueConstructor<Vue & EntryMixin & SurveySubmissionsRefs>).extend({
  name: 'SurveySubmissions',

  components: { ConfirmDialog, DataTable },

  mixins: [detailMixin],

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
      selected: {},
    };
  },

  computed: {
    isCreate(): boolean {
      return !Object.keys(this.selected).length;
    },
  },

  methods: {
    async remove(item: SurveySubmissionEntry) {
      console.log(item);
    },
  },
});
</script>

<style lang="scss" scoped></style>
