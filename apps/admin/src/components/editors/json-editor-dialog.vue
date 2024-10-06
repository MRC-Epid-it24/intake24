<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <template #activator="{ props }">
      <slot name="activator" v-bind="{ props }">
        <v-list-item link v-bind="props">
          <template #prepend>
            <v-icon icon="fas fa-code" />
          </template>
          <v-list-item-title>
            {{ $t('common.json._') }}
          </v-list-item-title>
        </v-list-item>
      </slot>
    </template>
    <v-card tile>
      <v-toolbar color="secondary" dark>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="close" />
        <v-toolbar-title>
          {{ $t('common.json.title') }}
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn :title="$t('common.action.ok')" variant="text" @click.stop="confirm">
            <v-icon icon="$success" start />{{ $t('common.action.ok') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <json-editor-vue v-model="content" :stringified="false" />
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'JsonEditorDialog',

  components: {
    JsonEditorVue: defineAsyncComponent(() => import('json-editor-vue')),
  },

  props: {
    modelValue: {
      type: [Array, Object],
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const dialog = ref(false);
    const content = ref(props.modelValue);

    watch(dialog, (val) => {
      if (!val)
        return;

      content.value = props.modelValue;
    });

    const close = () => {
      dialog.value = false;
    };

    const confirm = () => {
      emit('update:modelValue', content.value);
      close();
    };

    return { dialog, content, close, confirm };
  },
});
</script>
