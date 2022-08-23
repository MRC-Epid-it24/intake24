<template>
  <v-btn
    color="primary"
    icon
    :title="$t('common.action.edit')"
    :to="{ name: `${route}-edit`, params: { id: item.id } }"
  >
    <v-icon dark>{{ icon }}</v-icon>
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
