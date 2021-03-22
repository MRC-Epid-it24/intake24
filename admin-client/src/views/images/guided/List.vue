<template>
  <gallery title="id" subtitle="description" imageUrl="selectionImageUrl"> </gallery>
</template>

<script lang="ts">
import Vue from 'vue';
import Gallery from '@/components/gallery/Gallery.vue';

export default Vue.extend({
  name: 'GuidedImagesList',

  components: { Gallery },
});
</script>
