<template>
  <v-btn
    color="primary"
    icon
    :to="{ name: `${route}-edit`, params: { id: item.id } }"
    :title="$t('common.action.edit')"
  >
    <v-icon dark>{{ icon }}</v-icon>
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
