<template>
  <v-btn
    color="error"
    :disabled="disabled"
    :title="$t('common.action.delete')"
    @click.stop="onClick"
  >
    <v-icon left v-text="icon"></v-icon> {{ $t('common.action.delete') }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionMixin from './ActionMixin';

export default Vue.extend({
  name: 'Delete',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
