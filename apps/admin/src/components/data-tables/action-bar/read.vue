<template>
  <v-btn
    color="primary"
    icon
    :title="$t('common.action.read')"
    :to="{ name: `${route}-read`, params: { id: item.id } }"
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
