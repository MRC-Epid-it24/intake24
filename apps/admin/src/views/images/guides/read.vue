<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <guide-drawer :entry="entry" disabled></guide-drawer>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
import GuideDrawer from '../guide-drawer.vue';

export default defineComponent({
  name: 'GuideImageDetail',

  components: { GuideDrawer },

  mixins: [detailMixin],
});
</script>

<style lang="scss"></style>
