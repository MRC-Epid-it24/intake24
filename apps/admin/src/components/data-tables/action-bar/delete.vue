<template>
  <confirm-dialog color="error" icon icon-left="$delete" :label="internalTitle" @confirm="onClick">
    {{ $t('common.action.confirm.delete', { name: item.name ? item.name : item.id }) }}
  </confirm-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ConfirmDialog } from '@intake24/ui';

import ActionMixin from './action-mixin';

export default defineComponent({
  name: 'DeleteAction',

  components: { ConfirmDialog },

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
