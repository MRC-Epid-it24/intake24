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
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { DetailMixin } from '@intake24/admin/types';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'SurveySchemeDetail',

  components: { CopySchemeDialog },

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
