<script setup lang='ts'>

</script>

<template>
  <v-card flat>
    <v-card-title>
      {{ $t('surveys.search.information.matchScoreWeightInfo.title') }}
    </v-card-title>
    <v-card-text>
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchScoreWeightInfo.p1')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchScoreWeightInfo.foodOrdering')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchScoreWeightInfo.matchQuality')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchScoreWeightInfo.p2')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchScoreWeightInfo.p3')" />
    </v-card-text>
  </v-card>
</template>

<style scoped lang='scss'>

</style>
