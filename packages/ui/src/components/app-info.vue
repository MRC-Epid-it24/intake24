<template>
  <v-list flat subheader two-line>
    <v-subheader>{{ $t('common.app.info') }}</v-subheader>
    <v-list-item>
      <v-list-item-avatar>
        <v-icon class="secondary" dark>
          fas fa-code-branch
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title> {{ $t('common.app._') }}: {{ app.name }} </v-list-item-title>
        <v-list-item-subtitle>
          {{ $t('common.app.build') }}: {{ app.build.version }} ({{ app.build.revision }})
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="clipboardAvailable">
        <v-btn icon :title="$t('common.clipboard._')" @click="copyInfoToClipboard">
          <v-icon color="secondary">
            far fa-clipboard
          </v-icon>
        </v-btn>
      </v-list-item-action>
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
