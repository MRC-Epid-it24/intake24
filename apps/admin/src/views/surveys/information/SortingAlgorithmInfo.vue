<script setup lang='ts'>

</script>

<template>
  <v-card flat>
    <v-card-title>
      {{ $t('surveys.search.information.sortingAlgorithmInfo.title') }}
    </v-card-title>
    <v-card-text>
      <p v-dompurify-html:i18n="$t('surveys.search.information.sortingAlgorithmInfo.p1')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.sortingAlgorithmInfo.popularity')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.sortingAlgorithmInfo.globalPopularity')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.sortingAlgorithmInfo.predeterminedOrder')" />
    </v-card-text>
  </v-card>
</template>

<style scoped lang='scss'>

</style>
