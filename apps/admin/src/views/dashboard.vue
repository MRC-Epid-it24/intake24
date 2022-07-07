<template>
  <div class="py-3">
    <web-push></web-push>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WebPush from '@intake24/admin/components/web-push/web-push.vue';

export default defineComponent({
  name: 'AppDashboard',

  components: { WebPush },
});
</script>

<style lang="scss"></style>
