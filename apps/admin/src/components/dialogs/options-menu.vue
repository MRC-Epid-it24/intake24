<template>
  <v-menu v-model="menu" close-on-click left offset-y>
    <template #activator="{ attrs, on }">
      <slot name="activator" v-bind="{ attrs, on }">
        <v-btn
          v-bind="attrs"
          class="ml-3"
          color="primary"
          fab
          small
          :title="$t('common.options._')"
          v-on="on"
        >
          <v-icon>$options</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-list>
      <slot />
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
