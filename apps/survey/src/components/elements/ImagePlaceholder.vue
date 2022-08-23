<template>
  <v-alert outlined text>
    <v-progress-circular class="mr-2" color="primary" indeterminate></v-progress-circular>
    {{ $t('portion.option.imageInvalid') }}
  </v-alert>
</template>

<script lang="ts">
export default {
  name: 'ImagePlaceholder',
};
</script>

<style></style>
