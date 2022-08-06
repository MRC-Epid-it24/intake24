<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <template v-slot:actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        :schemeId="id"
        resource="survey-schemes"
      ></copy-scheme-dialog>
    </template>
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('common.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('survey-schemes.types._') }}</th>
          <td>{{ entry.type }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { SurveySchemeEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';

export default defineComponent({
  name: 'SurveySchemeDetail',

  components: { CopySchemeDialog },

  mixins: [detailMixin],

  setup(props) {
    const { canHandleEntry, entry, entryLoaded } = useStoreEntry<SurveySchemeEntry>(props.id);

    return { canHandleEntry, entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
