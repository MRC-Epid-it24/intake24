<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <template v-slot:actions>
      <copy-scheme-dialog v-if="can('schemes-edit')" :schemeId="id"></copy-scheme-dialog>
    </template>
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('schemes.id') }}</th>
          <td>{{ entry.id }}</td>
        </tr>
        <tr>
          <th>{{ $t('schemes.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('schemes.types._') }}</th>
          <td>{{ entry.type }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { DetailMixin } from '@/types';
import detailMixin from '@/components/entry/detailMixin';
import CopySchemeDialog from './copy-scheme-dialog.vue';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'SchemeDetail',

  components: { CopySchemeDialog },

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
