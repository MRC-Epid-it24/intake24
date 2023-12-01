<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <template #actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        resource="feedback-schemes"
        :scheme-id="id"
      ></copy-scheme-dialog>
      <preview :feedback-scheme="entry"></preview>
    </template>
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('common.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('feedback-schemes.types._') }}</th>
          <td>{{ entry.type }}</td>
        </tr>
        <tr>
          <th>{{ $t('feedback-schemes.physicalDataFields.title') }}</th>
          <td>
            {{
              entry.physicalDataFields
                .map((field) => $t(`feedback-schemes.physicalDataFields.${field}`))
                .join(', ')
            }}
          </td>
        </tr>
        <tr>
          <th>{{ $t('feedback-schemes.outputs.title') }}</th>
          <td>
            {{ entry.outputs.map((output) => $t(`feedback-schemes.outputs.${output}`)).join(', ') }}
          </td>
        </tr>
        <tr>
          <th>{{ $t('securables.visibility._') }}</th>
          <td>{{ $t(`securables.visibility.${entry.visibility}`) }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { detailMixin } from '@intake24/admin/components/entry';
import { Preview } from '@intake24/admin/components/feedback';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { useEntry, useEntryFetch } from '@intake24/admin/composables';

export default defineComponent({
  name: 'FeedbackSchemeDetail',

  components: { CopySchemeDialog, Preview },

  mixins: [detailMixin],

  setup(props) {
    const { canHandleEntry, entry, entryLoaded } = useEntry<FeedbackSchemeEntry>(props);
    useEntryFetch(props);

    return { canHandleEntry, entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
