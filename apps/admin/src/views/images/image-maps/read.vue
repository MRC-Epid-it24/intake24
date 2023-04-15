<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-row>
      <v-col cols="12">
        <v-simple-table>
          <tbody>
            <tr>
              <th>{{ $t('image-maps.id') }}</th>
              <td>{{ entry.id }}</td>
            </tr>
            <tr>
              <th>{{ $t('common.description') }}</th>
              <td>{{ entry.description }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <guide-drawer disabled :entry="entry"></guide-drawer>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ImageMapEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';

import GuideDrawer from '../guide-drawer.vue';

export default defineComponent({
  name: 'ImageMapDetail',

  components: { GuideDrawer },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<ImageMapEntry>(props);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss"></style>
