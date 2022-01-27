<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <template v-slot:actions>
      <copy-scheme-dialog v-if="can('survey-schemes|edit')" :schemeId="id"></copy-scheme-dialog>
    </template>
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('survey-schemes.name') }}</th>
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
import Vue, { VueConstructor } from 'vue';
import { DetailMixin } from '@intake24/admin/types';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
import CopySchemeDialog from './copy-scheme-dialog.vue';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'SurveySchemeDetail',

  components: { CopySchemeDialog },

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
