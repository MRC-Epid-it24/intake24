<template>
  <v-btn color="secondary" icon :title="internalTitle" :to="internalTo">
    <v-icon dark>{{ icon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ActionMixin from './action-mixin';

export default defineComponent({
  name: 'ReadAction',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
