<template>
  <v-menu v-model="menu" location="left" :persistent="false">
    <template #activator="{ props }">
      <slot name="activator" v-bind="{ props }">
        <v-btn
          class="ms-2"
          color="primary"
          icon="$options"
          size="small"
          :title="$t('common.options._')"
          v-bind="props"
        />
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
