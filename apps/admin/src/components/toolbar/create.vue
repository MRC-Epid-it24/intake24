<template>
  <v-btn
    color="primary"
    :title="$t(`${module}.create`)"
    :to="{ name: `${route}-create` }"
  >
    <v-icon :icon="icon" start />
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
