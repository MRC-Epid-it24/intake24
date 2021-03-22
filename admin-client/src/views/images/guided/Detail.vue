<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
    <guide-drawer :entry="entry" disabled></guide-drawer>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import type { DetailMixin } from '@/types';
import { GuideImageEntry } from '@common/types/http/admin';
import detailMixin from '@/components/entry/detailMixin';
import GuideDrawer from './GuideDrawer.vue';

export default (Vue as VueConstructor<Vue & DetailMixin<GuideImageEntry>>).extend({
  name: 'GuideImageDetail',

  components: { GuideDrawer },

  mixins: [detailMixin],
});
</script>

<style lang="scss"></style>
