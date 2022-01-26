<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <template v-slot:actions>
      <!-- <copy-scheme-dialog v-if="can('feedback-schemes|edit')" :schemeId="id"></copy-scheme-dialog> -->
    </template>
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('feedback-schemes.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('feedback-schemes.types._') }}</th>
          <td>{{ entry.type }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { DetailMixin } from '@intake24/admin/types';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
// import CopySchemeDialog from './copy-scheme-dialog.vue';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'FeedbackSchemeDetail',

  // components: { CopySchemeDialog },

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
