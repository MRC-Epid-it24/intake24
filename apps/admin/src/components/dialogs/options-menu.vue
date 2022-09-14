<template>
  <v-menu v-model="menu" close-on-click left offset-y>
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ attrs, on }">
        <v-btn
          v-bind="attrs"
          class="ml-3"
          color="secondary"
          fab
          small
          :title="$t('common.options')"
          v-on="on"
        >
          <v-icon>fas fa-ellipsis-vertical</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-list>
      <slot></slot>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OptionsMenu',

  data() {
    return {
      menu: false,
    };
  },

  methods: {
    close() {
      this.menu = false;
    },
  },
});
</script>
