<template>
  <v-btn color="error" icon :title="$t('common.action.delete')" @click.stop="onClick">
    <v-icon dark v-text="icon"></v-icon>
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
