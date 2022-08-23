<template>
  <gallery subtitle="description" title="id"></gallery>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Gallery from '@intake24/admin/components/gallery/gallery.vue';

export default defineComponent({
  name: 'AsServedList',

  components: { Gallery },
});
</script>
