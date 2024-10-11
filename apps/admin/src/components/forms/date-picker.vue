<template>
  <v-dialog v-model="dialog" persistent width="290px">
    <template #activator="{ props }">
      <v-text-field
        :clearable="clearable"
        :error-messages="errorMessages"
        hide-details="auto"
        :label="label"
        :model-value="formattedValue"
        prepend-inner-icon="fas fa-calendar-days"
        readonly
        variant="outlined"
        v-bind="props"
        @click:clear="internalValue = null"
      />
    </template>
    <v-date-picker v-model="internalValue" scrollable>
      <template #actions>
        <v-btn class="font-weight-medium" color="error" variant="text" @click="dialog = false">
          {{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          class="font-weight-medium"
          color="secondary"
          variant="text"
          @click="update"
        >
          {{ $t('common.action.ok') }}
        </v-btn>
      </template>
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
    modelValue: {
      type: [Date, String] as PropType<string | Date | null>,
    },
  },

  emits: ['update:modelValue', 'change'],

  setup(props, { emit }) {
    const toDate = (val: string | Date | null | undefined): Date | null => {
      if (val instanceof Date)
        return val;

      if (typeof val === 'string')
        return new Date(val);

      return null;
    };
    const dialog = ref(false);
    const internalValue = ref(toDate(props.modelValue));

    const formattedValue = computed(() => props.modelValue ? formatDate(props.modelValue, 'dd/MM/yyyy') : '');

    watch(() => props.modelValue, (val) => {
      if (toDate(val) === internalValue.value)
        return;

      internalValue.value = toDate(val);
    });

    function update() {
      emit('update:modelValue', internalValue.value);
      dialog.value = false;
    }

    return { dialog, formattedValue, internalValue, update };
  },
});
</script>

<style scoped></style>
