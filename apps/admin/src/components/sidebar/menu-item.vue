<template>
  <v-list-item link :to="{ name: item.name }">
    <v-list-item-action>
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>{{ title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Resource } from '@intake24/admin/types';

export default defineComponent({
  name: 'MenuItem',

  props: {
    item: {
      type: Object as PropType<Resource>,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    title(): string {
      const { name, title } = this.item;
      return this.$t(title ?? `${name}.title`).toString();
    },
  },
});
</script>

<style lang="scss" scoped></style>
