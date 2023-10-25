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
      <v-card-title class="text-h4 d-flex justify-center">
        <slot name="title">
          {{ titleLabel }}
        </slot>
      </v-card-title>
      <v-card-text class="px-6 py-4">
        <div class="text-subtitle-1 d-flex justify-center">
          <slot></slot>
        </div>
      </v-card-text>
      <template v-if="typedConfirm">
        <v-divider></v-divider>
        <v-card-text class="px-6 py-4">
          <i18n class="text-subtitle-1 mb-2" path="common.action.confirm.typed" tag="p">
            <template #name>
              <code class="font-weight-bold error--text">{{ `DELETE ${typedConfirm}` }}</code>
            </template>
          </i18n>
          <v-text-field
            v-model="confirmInput"
            class="error--text"
            color="error"
            dense
            hide-details="auto"
            outlined
          >
          </v-text-field>
        </v-card-text>
      </template>
      <v-container class="pa-6">
        <v-expand-transition>
          <v-btn
            v-if="canConfirm"
            block
            class="mb-3"
            :color="color"
            large
            :title="confirmLabel"
            @click.stop="confirm"
          >
            <v-icon v-if="confirmIcon" left>{{ confirmIcon }}</v-icon
            >{{ confirmLabel }}
          </v-btn>
        </v-expand-transition>

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
import { computed, defineComponent, ref, watch } from 'vue';

import { useI18n } from '@intake24/i18n';

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
    confirmIcon: {
      type: String,
    },
    confirmText: {
      type: String,
    },
    cancelIcon: {
      type: String,
    },
    cancelText: {
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
    typedConfirm: {
      type: String,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['cancel', 'close', 'confirm', 'input'],

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const dialog = ref(props.value);

    const cancelLabel = computed(
      () => props.cancelText ?? i18n.t('common.action.cancel').toString()
    );
    const confirmLabel = computed(() => props.confirmText ?? props.label);
    const titleLabel = computed(
      () => props.titleText ?? i18n.t('common.action.confirm.title').toString()
    );

    const confirmInput = ref('');
    const canConfirm = computed(
      () => !props.typedConfirm || `DELETE ${props.typedConfirm}` === confirmInput.value
    );

    const close = () => {
      dialog.value = false;
    };

    const cancel = () => {
      close();
      emit('cancel');
    };

    const confirm = () => {
      close();
      emit('confirm');
    };

    watch(
      () => props.value,
      (val) => {
        dialog.value = val;
      }
    );

    watch(dialog, (val) => {
      if (!val) emit('close');
    });

    return {
      canConfirm,
      confirm,
      confirmInput,
      cancel,
      dialog,
      cancelLabel,
      confirmLabel,
      titleLabel,
    };
  },
});
</script>
