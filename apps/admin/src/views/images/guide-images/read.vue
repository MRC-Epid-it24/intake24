<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-row>
      <v-col cols="12">
        <v-simple-table>
          <tbody>
            <tr>
              <th>{{ $t('guide-images.id') }}</th>
              <td>{{ entry.id }}</td>
            </tr>
            <tr>
              <th>{{ $t('common.description') }}</th>
              <td>{{ entry.description }}</td>
            </tr>
            <tr>
              <th>{{ $t('image-maps._') }}</th>
              <td>{{ entry.imageMapId }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <guide-drawer :entry="entry" disabled></guide-drawer>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { GuideImageEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';

import GuideDrawer from '../guide-drawer.vue';

export default defineComponent({
  name: 'GuideImageDetail',

  components: { GuideDrawer },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<GuideImageEntry>(props.id);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss"></style>
