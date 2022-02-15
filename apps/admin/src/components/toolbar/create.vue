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
import { defineComponent } from '@vue/composition-api';
import ActionMixin from './action-mixin';

export default defineComponent({
  name: 'CreateAction',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
