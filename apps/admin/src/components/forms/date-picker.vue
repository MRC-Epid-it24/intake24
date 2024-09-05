<template>
  <v-dialog ref="menu" v-model="dialog" persistent :return-value.sync="internalValue" width="290px">
    <template #activator="{ attrs, on }">
      <v-text-field
        :clearable="clearable"
        :error-messages="errorMessages"
        hide-details="auto"
        :label="label"
        outlined
        v-bind="attrs"
        prepend-inner-icon="fas fa-calendar-days"
        readonly
        :value="formattedInternalValue"
        v-on="on"
        @click:clear="internalValue = null"
      />
    </template>
    <v-date-picker v-model="internalValue" scrollable>
      <v-btn class="font-weight-medium" color="error" text @click="dialog = false">
        {{ $t('common.action.cancel') }}
      </v-btn>
      <v-spacer />
      <v-btn
        class="font-weight-medium"
        color="secondary"
        text
        @click="$refs.menu.save(internalValue)"
      >
        {{ $t('common.action.ok') }}
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';

import { formatDate } from '@intake24/admin/util';

export default defineComponent({
  name: 'DatePicker',

  props: {
    clearable: {
      type: Boolean,
    },
    errorMessages: {
      type: [String, Array] as PropType<string | string[]>,
    },
    label: {
      type: String,
    },
    value: {
      type: [Date, String] as PropType<string | Date | null>,
    },
  },

  emits: ['input', 'change'],

  setup(props, { emit }) {
    // const menu = ref<InstanceType<typeof VMenu>>();
    const toDate = (val: string | Date | null | undefined): string | null => {
      if (val instanceof Date)
        return val.toISOString().split('T')[0];

      if (typeof val === 'string')
        return val.substring(0, 10);

      return null;
    };
    const dialog = ref(false);
    const internalValue = ref(toDate(props.value));

    const formattedInternalValue = computed(() => internalValue.value ? formatDate(internalValue.value, 'dd/MM/yyyy') : '');

    watch(() => props.value, (val) => {
      if (val === internalValue.value)
        return;

      internalValue.value = toDate(val);
    });

    watch(internalValue, (val) => {
      if (val === props.value)
        return;

      emit('input', val);
      emit('change');
    });

    return { dialog, formattedInternalValue, internalValue };
  },
});
</script>

<style scoped></style>
