<template>
  <v-btn
    color="primary"
    :disabled="disabled"
    :title="$t('common.action.read')"
    @click.stop="onClick"
  >
    <v-icon left>{{ icon }}</v-icon> {{ $t('common.action.read') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import ActionMixin from './action-mixin';

export default defineComponent({
  name: 'ReadAction',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
