<template>
  <v-alert text type="info">{{ $t('fdbs.portionSizeMethods.methods.noParameters') }}</v-alert>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NoParameters',
});
</script>
