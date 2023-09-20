<template>
  <v-dialog v-model="dialog" :max-width="maxWidth" :persistent="persistent">
    <template v-if="!external" #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn
          v-if="show"
          v-bind="attrs"
          :class="activatorClass"
          :color="iconColor ? iconColor : color"
          :disabled="disabled"
          :fab="fab"
          :icon="icon"
          :title="label"
          v-on="on"
        >
          <v-icon :left="!icon && !!iconLeft">{{ iconLeft }}</v-icon>
          <template v-if="!icon">{{ label }}</template>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title class="h2 d-flex justify-center">
        <slot name="title">
          {{ titleLabel }}
        </slot>
      </v-card-title>
      <v-card-text class="px-6 py-4">
        <div class="text-subtitle-1 d-flex justify-center">
          <slot></slot>
        </div>
      </v-card-text>
      <v-container class="pa-6">
        <v-btn
          block
          class="mb-3"
          :color="color"
          dark
          large
          :title="confirmLabel"
          @click.stop="confirm"
        >
          <v-icon v-if="confirmIcon" left>{{ confirmIcon }}</v-icon
          >{{ confirmLabel }}
        </v-btn>
        <v-btn block :color="color" large outlined :title="cancelLabel" @click.stop="cancel">
          <v-icon v-if="cancelIcon" left>{{ cancelIcon }}</v-icon
          >{{ cancelLabel }}
        </v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConfirmDialog',

  props: {
    activatorClass: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    color: {
      type: String,
      default: 'info',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    external: {
      type: Boolean,
      default: false,
    },
    fab: {
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
      required: true,
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
    value: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['cancel', 'close', 'confirm', 'input'],

  data() {
    return {
      dialog: this.value,
    };
  },

  computed: {
    confirmLabel(): string {
      return this.confirmText ?? this.label;
    },
    cancelLabel(): string {
      return this.cancelText ?? this.$t('common.action.cancel').toString();
    },
    titleLabel(): string {
      return this.titleText ?? this.$t('common.action.confirm.title').toString();
    },
  },

  watch: {
    value(val) {
      if (val === this.dialog) return;

      this.dialog = val;
    },
    dialog(val) {
      if (val === false) this.$emit('close');

      this.$emit('input', val);
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

    open() {
      this.dialog = true;
    },
  },
});
</script>
