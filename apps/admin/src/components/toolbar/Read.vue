<template>
  <v-btn
    color="primary"
    :disabled="disabled"
    :title="$t('common.action.read')"
    @click.stop="onClick"
  >
    <v-icon left v-text="icon"></v-icon> {{ $t('common.action.read') }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionMixin from './ActionMixin';

export default Vue.extend({
  name: 'Read',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
