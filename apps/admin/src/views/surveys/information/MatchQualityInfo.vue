<script setup lang='ts'>

</script>

<template>
  <v-card flat>
    <v-card-title>
      {{ $t('surveys.search.information.matchQualityInfo.title') }}
    </v-card-title>
    <v-card-text>
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchQualityInfo.p1')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchQualityInfo.p2')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchQualityInfo.p3')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchQualityInfo.firstWord')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchQualityInfo.wordOrder')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchQualityInfo.wordDistance')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.matchQualityInfo.wordCount')" />
    </v-card-text>
  </v-card>
</template>

<style scoped lang='scss'>

</style>
