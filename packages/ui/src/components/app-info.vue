<template>
  <v-list flat subheader two-line>
    <v-subheader>{{ 'App Info' }}</v-subheader>
    <v-list-item>
      <v-list-item-avatar>
        <v-icon class="primary" dark>fa-code-branch</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title> {{ 'App: ' }} {{ app.name }} </v-list-item-title>
        <v-list-item-subtitle>
          {{ 'Build: ' }}{{ app.build.version }} | {{ app.build.revision }} |
          {{ app.build.date }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
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

  methods: {
    async copyInfoToClipboard() {
      const { version, revision, date } = this.app.build;
      await navigator.clipboard.writeText([version, revision, date].join(' | '));
      useMessages().info(this.$t('common.clipboard.copied').toString());
    },
  },
});
</script>
