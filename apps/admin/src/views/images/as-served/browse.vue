<template>
  <gallery title="id" subtitle="description"></gallery>
</template>

<script lang="ts">
import Vue from 'vue';
import Gallery from '@/components/gallery/gallery.vue';

export default Vue.extend({
  name: 'AsServedList',

  components: { Gallery },
});
</script>
