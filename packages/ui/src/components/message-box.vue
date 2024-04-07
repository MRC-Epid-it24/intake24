<template>
  <div class="d-flex flex-column">
    <v-snackbar
      v-for="(message, idx) in messages"
      :key="message.id"
      v-model="message.show"
      :color="message.type"
      :style="{ 'margin-bottom': calculateMargin(idx) }"
      :timeout="message.timeout"
      @input="clean($event, message.id)"
    >
      {{ message.text }}
      <template #action="{ attrs }">
        <v-btn dark icon v-bind="attrs" @click="dismiss(message.id)">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { MessageType } from '../stores';
import { useMessages } from '../stores';

export default defineComponent({
  name: 'MessageBox',

  data() {
    return {
      store: useMessages(),
    };
  },

  computed: {
    messages() {
      return this.store.items;
    },
  },

  methods: {
    calculateMargin(index: number) {
      return `${index * 60}px`;
    },

    add(type: MessageType, text: string, timeout = 10000) {
      return this.store.add(type, text, timeout);
    },

    clean(value: boolean, id: string) {
      if (value)
        return;

      this.store.remove(id);
    },

    dismiss(id: string) {
      this.store.remove(id);
    },
  },
});
</script>
