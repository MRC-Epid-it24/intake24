<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <template #actions>
      <confirm-dialog
        v-if="can({ action: 'edit' })"
        :activator-class="['ml-2']"
        color="secondary"
        icon-left="fas fa-play"
        :label="$t('tasks.run._').toString()"
        @confirm="triggerJob"
      >
        {{ $t('tasks.run.confirm') }}
      </confirm-dialog>
    </template>
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('common.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('tasks.job') }}</th>
          <td>{{ entry.job }}</td>
        </tr>
        <tr>
          <th>{{ $t('tasks.cron') }}</th>
          <td>
            <pre>{{ readableCron }} | "{{ entry.cron }}"</pre>
          </td>
        </tr>
        <tr>
          <th>{{ $t('common.action.active') }}</th>
          <td>
            <v-icon v-if="entry.active" color="success" left>fa-check-circle</v-icon>
            <v-icon v-else color="error" left>fa-times-circle</v-icon>
            {{ $t(`common.${entry.active}`) }}
          </td>
        </tr>
        <tr v-if="entry.bullJob">
          <th>{{ $t('tasks.run.next') }}</th>
          <td>{{ formatDate(new Date(entry.bullJob.next)) }}</td>
        </tr>
        <tr>
          <th>{{ $t('common.description') }}</th>
          <td>{{ entry.description }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import cronstrue from 'cronstrue';
import { defineComponent } from 'vue';

import type { TaskEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { formatsDateTime } from '@intake24/admin/mixins';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'TaskDetail',

  components: { ConfirmDialog },

  mixins: [detailMixin, formatsDateTime],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<TaskEntry>(props);

    return { entry, entryLoaded };
  },

  computed: {
    readableCron(): string {
      return cronstrue.toString(this.entry.cron, { use24HourTimeFormat: true, verbose: true });
    },
  },

  methods: {
    async triggerJob() {
      await this.$http.post(`admin/tasks/${this.id}/run`);
    },
  },
});
</script>

<style scoped></style>
