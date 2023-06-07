<template>
  <v-list flat subheader two-line>
    <v-subheader>{{ $t('common.app.info') }}</v-subheader>
    <v-list-item>
      <v-list-item-avatar>
        <v-icon class="primary" dark>fas fa-code-branch</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title> {{ $t('common.app._') }}: {{ app.name }} </v-list-item-title>
        <v-list-item-subtitle>
          {{ $t('common.app.build') }}: {{ app.build.version }} ({{ app.build.revision }})
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="clipboardAvailable">
        <v-btn icon :title="$t('common.clipboard._')" @click="copyInfoToClipboard">
          <v-icon color="primary">far fa-clipboard</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useApp, useMessages } from '../stores';

export default defineComponent({
  name: 'AppInfo',

  data() {
    return {
      app: useApp().app,
    };
  },

  computed: {
    clipboardAvailable() {
      return !!navigator.clipboard;
    },
  },

  methods: {
    async copyInfoToClipboard() {
      if (!this.clipboardAvailable) return;

      const { version, revision } = this.app.build;
      await navigator.clipboard.writeText(`${version} (${revision})`);
      useMessages().info(this.$t('common.clipboard.copied').toString());
    },
  },
});
</script>
