<template>
  <v-btn
    color="secondary"
    :disabled="disabled"
    :title="$t('common.action.edit')"
    @click.stop="onClick"
  >
    <v-icon :icon="icon" start />
    {{ $t('common.action.edit') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ActionMixin from './action-mixin';

export default defineComponent({
  name: 'EditAction',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
