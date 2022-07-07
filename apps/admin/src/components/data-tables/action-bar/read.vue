<template>
  <v-btn
    color="primary"
    icon
    :to="{ name: `${route}-read`, params: { id: item.id } }"
    :title="$t('common.action.read')"
  >
    <v-icon dark>{{ icon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ActionMixin from './action-mixin';

export default defineComponent({
  name: 'ReadAction',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
