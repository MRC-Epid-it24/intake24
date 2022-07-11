<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <guide-drawer :entry="entry" disabled></guide-drawer>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import GuideDrawer from '../guide-drawer.vue';
import type { GuideImageEntry } from '@intake24/common/types/http/admin';

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
