<template>
  <div>
    <dynamic-recall-mobile v-if="isNotDesktop"></dynamic-recall-mobile>
    <dynamic-recall-desktop v-if="!isNotDesktop"></dynamic-recall-desktop>
  </div>
</template>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
<script>
import DynamicRecallMobile from './recall-mobile.vue';
import DynamicRecallDesktop from './recall-desktop.vue';

export default {
  components: { DynamicRecallDesktop, DynamicRecallMobile },
};
</script>
