<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <guide-drawer :entry="entry" disabled></guide-drawer>
  </layout>
</template>

<script lang="ts">
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { ImageMapEntry } from '@intake24/common/types/http/admin';
import type { DetailMixin } from '@intake24/admin/types';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
import GuideDrawer from '../guide-drawer.vue';

export default (Vue as VueConstructor<Vue & DetailMixin<ImageMapEntry>>).extend({
  name: 'ImageMapDetail',

  components: { GuideDrawer },

  mixins: [detailMixin],
});
</script>

<style lang="scss"></style>
