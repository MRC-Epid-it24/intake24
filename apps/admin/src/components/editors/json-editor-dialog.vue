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
            <v-icon left>
              fas fa-code
            </v-icon>
            {{ $t('common.json._') }}
          </v-list-item-title>
        </v-list-item>
      </slot>
    </template>
    <v-card tile>
      <v-toolbar color="secondary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('common.json.title') }}
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn dark text :title="$t('common.action.ok')" @click.stop="confirm">
            <v-icon left>
              $success
            </v-icon>{{ $t('common.action.ok') }}
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
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'JsonEditorDialog',

  components: {
    JsonEditorVue: () => import('json-editor-vue'),
  },

  props: {
    value: {
      type: [Array, Object],
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const dialog = ref(false);
    const content = ref(props.value);

    watch(dialog, (val) => {
      if (!val)
        return;

      content.value = props.value;
    });

    const close = () => {
      dialog.value = false;
    };

    const confirm = () => {
      emit('input', content.value);
      close();
    };

    return { dialog, content, close, confirm };
  },
});
</script>
