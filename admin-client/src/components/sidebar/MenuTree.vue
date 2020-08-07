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
import Vue from 'vue';
import { Resource } from '@/types/vue-router';
import MenuItem from './MenuItem.vue';

export default Vue.extend({
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
      type: Array as () => Resource[],
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
      return this.resources.filter((item) => this.can(`${item.name}-list`));
    },
  },
});
</script>

<style lang="scss" scoped></style>
