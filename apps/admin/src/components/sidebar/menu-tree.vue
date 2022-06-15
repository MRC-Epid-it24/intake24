<template>
  <v-list dense nav>
    <v-list-group value="true" color="grey lighten-1" :prepend-icon="icon">
      <template v-slot:activator>
        <v-list-item-title>{{ $t(`common.${name}`) }}</v-list-item-title>
      </template>
      <v-list-item-group>
        <menu-item v-for="item in items" :key="item.name" :item="item"></menu-item>
      </v-list-item-group>
    </v-list-group>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import type { Resource } from '@intake24/admin/types';
import MenuItem from './menu-item.vue';

export default defineComponent({
  name: 'MenuTree',

  components: { MenuItem },

  props: {
    expanded: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    resources: {
      type: Array as PropType<Resource[]>,
      required: true,
    },
  },

  data() {
    return {
      toggle: this.expanded,
    };
  },

  computed: {
    items(): Resource[] {
      return this.resources.filter((item) => this.can(item.name));
    },
  },
});
</script>

<style lang="scss" scoped></style>
