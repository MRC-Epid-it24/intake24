<template>
  <v-btn
    color="secondary"
    :to="{ name: `${route}-create`, params: { id: 'create' } }"
    :title="$t(`${module}.create`)"
  >
    <v-icon left>{{ icon }}</v-icon> {{ $t(`${module}.create`) }}
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
