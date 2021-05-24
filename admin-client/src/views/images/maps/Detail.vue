<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <guide-drawer :entry="entry" disabled></guide-drawer>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import type { DetailMixin } from '@/types';
import { ImageMapEntry } from '@common/types/http/admin';
import detailMixin from '@/components/entry/detailMixin';
import GuideDrawer from '../GuideDrawer.vue';

export default (Vue as VueConstructor<Vue & DetailMixin<ImageMapEntry>>).extend({
  name: 'ImageMapDetail',

  components: { GuideDrawer },

  mixins: [detailMixin],
});
</script>

<style lang="scss"></style>
