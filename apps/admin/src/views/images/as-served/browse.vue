<template>
  <gallery title="id" subtitle="description"></gallery>
</template>

<script lang="ts">
import Vue from 'vue';
import Gallery from '@intake24/admin/components/gallery/gallery.vue';

export default Vue.extend({
  name: 'AsServedList',

  components: { Gallery },
});
</script>
