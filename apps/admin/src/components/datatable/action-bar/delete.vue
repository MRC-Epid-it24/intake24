<template>
  <confirm-dialog
    :label="$t('common.action.delete')"
    color="error"
    icon
    icon-left="$delete"
    @confirm="onClick"
  >
    {{ $t('common.action.confirm.delete', { name: item.name ? item.name : item.id }) }}
  </confirm-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { ConfirmDialog } from '@intake24/ui';
import ActionMixin from './action-mixin';

export default Vue.extend({
  name: 'DeleteAction',

  components: { ConfirmDialog },

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
