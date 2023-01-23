<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <template #activator="{ attrs, on }">
      <slot name="activator" v-bind="{ attrs, on }">
        <v-list-item v-bind="attrs" link v-on="on">
          <v-list-item-title>
            <v-icon left>fas fa-code</v-icon>
            {{ $t('common.json._') }}
          </v-list-item-title>
        </v-list-item>
      </slot>
    </template>
    <v-card tile>
      <v-toolbar color="primary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('common.json.title') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text :title="$t('common.action.ok')" @click.stop="confirm">
            <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <json-editor-vue v-model="content"></json-editor-vue>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type JsonEditorVue from 'json-editor-vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'JsonEditor',

  components: {
    JsonEditorVue: () => import('json-editor-vue'),
  },

  props: {
    value: {
      type: [Array, Object],
    },
  },

  emits: ['input'],

  setup() {
    const editor = ref<InstanceType<typeof JsonEditorVue>>();

    return { editor };
  },

  data() {
    return {
      dialog: false,
      content: this.value,
    };
  },

  watch: {
    dialog(val) {
      if (!val) return;

      this.content = this.value;
    },
  },

  methods: {
    close() {
      this.dialog = false;
    },

    confirm() {
      this.$emit('input', this.content);
      this.close();
    },
  },
});
</script>
