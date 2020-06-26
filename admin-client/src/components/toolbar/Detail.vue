<template>
  <v-btn
    color="primary"
    :disabled="disabled"
    :title="$t('common.action.detail')"
    @click.stop="onClick"
  >
    <v-icon left v-text="icon"></v-icon> {{ $t('common.action.detail') }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionMixin from './ActionMixin';

export default Vue.extend({
  name: 'Show',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
