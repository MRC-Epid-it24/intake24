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
import { defineComponent } from '@vue/composition-api';
import ActionMixin from './action-mixin';

export default defineComponent({
  name: 'EditAction',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
