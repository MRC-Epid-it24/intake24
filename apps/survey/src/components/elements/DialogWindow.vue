<template>
  <v-dialog :value="dialog" width="500">
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="toggleDialog(true)">
          {{ $t('common.action.confirm.yes') }}
        </v-btn>
        <v-btn color="secondary" text @click="toggleDialog(false)">
          {{ $t('common.action.confirm.no') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'DialogWindow',

  props: {
    title: String,
    message: String,
    type: String,
    dialog: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    toggleDialog(value: boolean) {
      this.$emit('dialog-change', value);
    },
  },
});
</script>
