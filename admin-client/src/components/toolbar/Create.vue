<template>
  <v-btn
    color="secondary"
    :to="{ name: `${route}-create`, params: { id: 'create' } }"
    :title="$t(`${module}.create`)"
  >
    <v-icon left v-text="icon"></v-icon> {{ $t(`${module}.create`) }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionMixin from './ActionMixin';

export default Vue.extend({
  name: 'Create',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
