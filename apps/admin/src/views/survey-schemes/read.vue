<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <template #actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        resource="survey-schemes"
        :scheme-id="id"
      />
    </template>
    <v-table>
      <tbody>
        <tr>
          <th>{{ $t('common.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('survey-schemes.settings.types._') }}</th>
          <td>{{ entry.settings.type }}</td>
        </tr>
        <tr>
          <th>{{ $t('survey-schemes.settings.flows._') }}</th>
          <td>{{ entry.settings.flow }}</td>
        </tr>
        <tr>
          <th>{{ $t('securables.visibility._') }}</th>
          <td>{{ $t(`securables.visibility.${entry.visibility}`) }}</td>
        </tr>
      </tbody>
    </v-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { detailMixin } from '@intake24/admin/components/entry';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { useEntry, useEntryFetch } from '@intake24/admin/composables';
import type { SurveySchemeEntry } from '@intake24/common/types/http/admin';

export default defineComponent({
  name: 'SurveySchemeDetail',

  components: { CopySchemeDialog },

  mixins: [detailMixin],

  setup(props) {
    useEntryFetch(props);
    const { canHandleEntry, entry, entryLoaded } = useEntry<SurveySchemeEntry>(props);

    return { canHandleEntry, entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
