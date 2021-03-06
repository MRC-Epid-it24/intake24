<template>
  <v-dialog v-model="dialog" :persistent="persistent" max-width="350px">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn
          ref="activator"
          v-if="show"
          v-bind="attrs"
          v-on="on"
          :color="color"
          :disabled="disabled"
          :icon="icon"
          :title="label"
        >
          <v-icon :left="!icon && !!iconLeft">{{ iconLeft }}</v-icon>
          <template v-if="!icon">{{ label }}</template>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title class="h2 d-flex justify-center">
        <slot name="title">{{ titleLabel }}</slot>
      </v-card-title>
      <v-card-text class="px-6 py-4">
        <div class="subtitle-1 d-flex justify-center">
          <v-icon left>fa-hand-point-right</v-icon>
          <slot></slot>
        </div>
      </v-card-text>
      <v-container class="pa-6">
        <v-btn :color="color" :title="confirmLabel" block class="mb-2" dark large @click="confirm">
          <v-icon v-if="confirmIcon" left>{{ confirmIcon }}</v-icon> {{ confirmLabel }}
        </v-btn>
        <v-btn :color="color" :title="cancelLabel" block outlined large @click="cancel">
          <v-icon v-if="cancelIcon" left>{{ cancelIcon }}</v-icon> {{ cancelLabel }}
        </v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    color: {
      type: String,
      default: 'secondary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    iconLeft: {
      type: String,
    },
    label: {
      type: String,
    },
    confirmText: {
      type: String,
    },
    confirmIcon: {
      type: String,
    },
    cancelText: {
      type: String,
    },
    cancelIcon: {
      type: String,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: true,
    },
    titleText: {
      type: String,
    },
  },

  data() {
    return {
      dialog: false,
    };
  },

  computed: {
    confirmLabel(): string {
      return this.confirmText ?? this.label;
    },
    cancelLabel(): string {
      return this.confirmText ?? this.$t('common.action.cancel');
    },
    titleLabel(): string {
      return this.titleText ?? this.$t('common.action.confirm.title');
    },
  },

  methods: {
    close() {
      this.dialog = false;
    },

    cancel() {
      this.close();
    },

    confirm() {
      this.close();
      this.$emit('confirm');
    },
  },
});
</script>
