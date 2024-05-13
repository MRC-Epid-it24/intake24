<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="800px">
    <v-card tile>
      <v-toolbar color="secondary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`${key}.title`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        {{ $t(`${key}.text`) }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn class="font-weight-bold" color="info" text @click.stop="close">
          <v-icon left>
            $success
          </v-icon>{{ $t('common.action.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'InformationPopup',

  props: {
    messageKey: {
      type: String,
      required: true,
    },
    popup,
  },

  setup() {
    const dialog = ref(false);

    const close = () => {
      dialog.value = false;
    };

    return {
      close,
      dialog,
    };
  },
});
</script>

<style lang="scss" scoped></style>
