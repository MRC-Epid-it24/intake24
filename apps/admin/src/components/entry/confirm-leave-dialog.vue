<template>
  <v-dialog max-width="350px" :value="value.dialog" @input="handleLeave">
    <v-card>
      <v-card-title class="h2 justify-center">
        {{ $t('common.action.confirm.title') }}
      </v-card-title>
      <v-card-text class="px-6 py-4 d-flex justify-center">
        <div class="subtitle-1">
          {{ $t('common.action.confirm.msg') }}
        </div>
      </v-card-text>
      <v-container class="pa-6">
        <v-btn
          block
          class="mb-2"
          color="warning"
          dark
          large
          :title="$t('common.action.continue')"
          @click.stop="confirmLeave"
        >
          {{ $t('common.action.continue') }}
        </v-btn>
        <v-btn
          block
          color="warning"
          large
          outlined
          :title="$t('common.action.cancel')"
          @click.stop="cancelLeave"
        >
          {{ $t('common.action.cancel') }}
        </v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { RouteLeave } from '@intake24/admin/types';

export default defineComponent({
  name: 'ConfirmLeaveDialog',

  props: {
    value: {
      type: Object as PropType<RouteLeave>,
      required: true,
    },
  },

  methods: {
    handleLeave(value: boolean) {
      if (value) return;

      this.cancelLeave();
    },

    cancelLeave() {
      this.$emit('input', { dialog: false, to: null, confirmed: false });
    },

    confirmLeave() {
      const { dialog, to } = this.value;

      if (!to) return;

      this.$emit('input', { dialog, to, confirmed: true });
      // TODO: vue-router RawLocation and Route types are incompatible (RawLocation:name cannot be null)
      this.$router.push({ ...to, name: to.name ?? undefined });
    },
  },
});
</script>
