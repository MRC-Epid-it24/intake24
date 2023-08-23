<template>
  <v-btn
    color="primary"
    :title="$t(`${module}.create`)"
    :to="{ name: `${route}-create`, params: { id: 'create' } }"
  >
    <v-icon left>{{ icon }}</v-icon>
    {{ $t(`${module}.create`) }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ActionMixin from './action-mixin';

export default defineComponent({
  name: 'CreateAction',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
