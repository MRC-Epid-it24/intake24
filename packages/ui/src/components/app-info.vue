<template>
  <v-list lines="two">
    <v-list-subheader>{{ $t('common.app.info') }}</v-list-subheader>
    <v-list-item>
      <template #prepend>
        <v-avatar color="secondary" icon="fas fa-code-branch" />
      </template>
      <v-list-item-title> {{ $t('common.app._') }}: {{ app.name }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ $t('common.app.build') }}: {{ app.build.fullVersion }}
      </v-list-item-subtitle>
      <template #append>
        <v-list-item-action v-if="clipboardAvailable">
          <v-btn icon="far fa-clipboard" :title="$t('common.clipboard._')" @click="copyInfoToClipboard" />
        </v-list-item-action>
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { useClipboard } from '../composables';
import { useApp } from '../stores';

export default defineComponent({
  name: 'AppInfo',

  setup() {
    const app = computed(() => useApp().app);
    const { toClipboard, clipboardAvailable } = useClipboard();

    const copyInfoToClipboard = async () => {
      const { version, revision } = app.value.build;
      await toClipboard(`${version} (${revision})`);
    };

    return { app, clipboardAvailable, copyInfoToClipboard };
  },
});
</script>
