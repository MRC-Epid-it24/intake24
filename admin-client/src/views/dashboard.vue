<template>
  <div class="py-3">
    <web-push></web-push>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import WebPush from '@/components/web-push/WebPush.vue';

export default Vue.extend({
  name: 'Dashboard',

  components: { WebPush },
});
</script>

<style lang="scss"></style>
