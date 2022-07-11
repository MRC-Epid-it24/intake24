<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <template v-slot:actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        :schemeId="id"
        resource="feedback-schemes"
      ></copy-scheme-dialog>
      <preview :feedbackScheme="entry"></preview>
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
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { Preview } from '@intake24/admin/components/feedback';
import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';

export default defineComponent({
  name: 'FeedbackSchemeDetail',

  components: { CopySchemeDialog, Preview },

  mixins: [detailMixin],

  setup(props) {
    const { canHandleEntry, entry, entryLoaded } = useStoreEntry<FeedbackSchemeEntry>(props.id);

    return { canHandleEntry, entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
