<template>
  <gallery title="id" subtitle="description"></gallery>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Gallery from '@intake24/admin/components/gallery/gallery.vue';

export default defineComponent({
  name: 'GuideImageList',

  components: { Gallery },
});
</script>
