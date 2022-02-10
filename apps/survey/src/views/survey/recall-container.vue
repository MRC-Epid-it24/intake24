<template>
  <component :is="layout"></component>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import RecallMobile from './recall-mobile.vue';
import RecallDesktop from './recall-desktop.vue';

export default defineComponent({
  name: 'RecallContainer',

  components: { RecallDesktop, RecallMobile },

  computed: {
    layout(): string {
      return this.isNotDesktop ? 'recall-mobile' : 'recall-desktop';
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
