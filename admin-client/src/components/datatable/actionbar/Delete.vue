<template>
  <confirm-dialog
    :label="$t('common.action.delete')"
    color="error"
    icon
    iconLeft="$delete"
    @confirm="onClick"
  >
    {{ $t('common.action.confirm.delete', { name: item.name ? item.name : item.id }) }}
  </confirm-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import ActionMixin from './ActionMixin';

export default Vue.extend({
  name: 'Delete',

  components: { ConfirmDialog },

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
