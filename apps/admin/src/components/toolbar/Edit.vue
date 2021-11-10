<template>
  <v-btn
    color="primary"
    :disabled="disabled"
    :title="$t('common.action.edit')"
    @click.stop="onClick"
  >
    <v-icon left v-text="icon"></v-icon> {{ $t('common.action.edit') }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionMixin from './ActionMixin';

export default Vue.extend({
  name: 'EditAction',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
