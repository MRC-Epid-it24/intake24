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
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { DetailMixin } from '@intake24/admin/types';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { Preview } from '@intake24/admin/components/feedback';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'FeedbackSchemeDetail',

  components: { CopySchemeDialog, Preview },

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
