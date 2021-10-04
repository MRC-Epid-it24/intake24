<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <template v-slot:actions>
      <confirm-dialog
        v-if="can({ action: 'edit' })"
        :label="$t('tasks.run._')"
        :activatorClass="['ml-2']"
        color="secondary"
        iconLeft="fas fa-play"
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
        <tr v-if="addons.bullJob">
          <th>{{ $t('tasks.run.next') }}</th>
          <td>{{ formatDate(new Date(addons.bullJob.next)) }}</td>
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
import Vue, { VueConstructor } from 'vue';
import cronstrue from 'cronstrue';
import { TaskEntry, TaskRefs, TaskResponse } from '@common/types/http/admin';
import { DetailMixin, MapAddonsMixin } from '@/types';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import detailMixin from '@/components/entry/detailMixin';
import mapAddons from '@/components/entry/mapAddons';
import FormatsDateTime from '@/mixins/FormatsDateTime';

export default (
  Vue as VueConstructor<Vue & DetailMixin<TaskEntry, TaskRefs> & MapAddonsMixin<TaskResponse>>
).extend({
  name: 'TaskDetail',

  components: { ConfirmDialog },

  mixins: [detailMixin, FormatsDateTime, mapAddons],

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
