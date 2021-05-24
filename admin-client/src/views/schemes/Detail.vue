<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
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
import { DetailMixin } from '@/types/vue';
import detailMixin from '@/components/entry/detailMixin';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'SchemeDetail',

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
