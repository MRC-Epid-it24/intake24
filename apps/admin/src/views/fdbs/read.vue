<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-row class="pa-4" justify="space-between">
      <v-col cols="5" lg="4" xl="3">
        <food-explorer :locale-id="id"></food-explorer>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="7" lg="8" xl="8">
        <v-scroll-y-transition mode="out-in">
          <router-view></router-view>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </layout>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { FoodExplorer } from '@intake24/admin/components/fdbs';

export default defineComponent({
  name: 'FoodDBDetail',

  components: { FoodExplorer },

  mixins: [detailMixin],

  setup(props) {
    const { id } = toRefs(props);
    const { entry, entryLoaded } = useStoreEntry(id);

    return { entry, entryLoaded };
  },
});
</script>
