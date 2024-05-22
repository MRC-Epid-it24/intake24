<script setup lang='ts'>

</script>

<template>
  <v-card flat>
    <v-card-title>
      {{ $t('surveys.search.information.relevantCategoriesInfo.title') }}
    </v-card-title>
    <v-card-text>
      <p v-dompurify-html:i18n="$t('surveys.search.information.relevantCategoriesInfo.p1')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.relevantCategoriesInfo.p2')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.relevantCategoriesInfo.p3')" />
      <p v-dompurify-html:i18n="$t('surveys.search.information.relevantCategoriesInfo.relevantCategoryDepth')" />
    </v-card-text>
  </v-card>
</template>

<style scoped lang='scss'>

</style>
