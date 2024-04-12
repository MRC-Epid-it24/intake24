<script setup lang='ts'>

</script>

<template>
  <v-card flat>
    <v-card-title>
      {{ $t('surveys.search.information.spellingCorrectionInfo.title') }}
    </v-card-title>
    <v-card-text>
      <p v-dompurify-html:i18n="$t('surveys.search.information.spellingCorrectionInfo.p1')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.spellingCorrectionInfo.editDistance')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.spellingCorrectionInfo.minimumWordLength')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.spellingCorrectionInfo.phonetic')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.spellingCorrectionInfo.phoneticMinWordLength')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.spellingCorrectionInfo.preferredMethod')" />
    </v-card-text>
  </v-card>
</template>

<style scoped lang='scss'>

</style>
