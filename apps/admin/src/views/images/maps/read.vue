<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <guide-drawer :entry="entry" disabled></guide-drawer>
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
    const { entry, entryLoaded } = useStoreEntry<ImageMapEntry>(props.id);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss"></style>
