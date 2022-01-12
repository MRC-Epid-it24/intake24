<template>
  <v-dialog v-model="dialog" :persistent="persistent" :max-width="maxWidth">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn
          v-if="show"
          v-bind="attrs"
          v-on="on"
          :class="activatorClass"
          :color="iconColor ? iconColor : color"
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
        <v-btn
          :color="color"
          :title="confirmLabel"
          block
          class="mb-2"
          dark
          large
          @click.stop="confirm"
        >
          <v-icon v-if="confirmIcon" left>{{ confirmIcon }}</v-icon> {{ confirmLabel }}
        </v-btn>
        <v-btn :color="color" :title="cancelLabel" block outlined large @click.stop="cancel">
          <v-icon v-if="cancelIcon" left>{{ cancelIcon }}</v-icon> {{ cancelLabel }}
        </v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ConfirmDialog',

  props: {
    activatorClass: {
      type: Array as () => string[],
      default: () => [],
    },
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
    iconColor: {
      type: String,
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
    maxWidth: {
      type: String,
      default: '350px',
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
      return this.cancelText ?? this.$t('common.action.cancel');
    },
    titleLabel(): string {
      return this.titleText ?? this.$t('common.action.confirm.title');
    },
  },

  watch: {
    dialog(val) {
      if (val === false) this.$emit('close');
    },
  },

  methods: {
    close() {
      this.dialog = false;
    },

    cancel() {
      this.close();
      this.$emit('cancel');
    },

    confirm() {
      this.close();
      this.$emit('confirm');
    },
  },
});
</script>
