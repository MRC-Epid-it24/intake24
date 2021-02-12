<template>
  <v-alert outlined text>
    <v-progress-circular
      indeterminate
      color="primary"
      class="mr-2"
    ></v-progress-circular>
    {{ $t('portion.option.imageInvalid') }}
  </v-alert>
</template>

<script>
export default {
  name: "ImagePlaceholder",

}
</script>

<style>

</style>