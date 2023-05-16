<template>
  <v-dialog ref="menu" v-model="dialog" persistent :return-value.sync="internalValue" width="290px">
    <template #activator="{ attrs, on }">
      <v-text-field
        v-model="formattedInternalValue"
        :clearable="clearable"
        :error-messages="errorMessages"
        hide-details="auto"
        :label="label"
        outlined
        v-bind="attrs"
        prepend-inner-icon="fas fa-calendar-days"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="internalValue" scrollable>
      <v-btn class="font-weight-medium" color="error" text @click="dialog = false">
        {{ $t('common.action.cancel') }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        class="font-weight-medium"
        color="primary"
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
import { defineComponent } from 'vue';

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
      type: String as PropType<string | null>,
    },
  },

  emits: ['input', 'change'],

  /* setup() {
    const menu = ref<InstanceType<typeof VMenu>>();

    return { menu };
  }, */

  data() {
    return {
      dialog: false,
      internalValue: this.value,
    };
  },

  computed: {
    formattedInternalValue(): string {
      return this.internalValue ? this.formatDate(this.internalValue, 'dd/MM/yyyy') : '';
    },
  },

  watch: {
    value(val) {
      if (val === this.internalValue) return;

      this.internalValue = val;
    },
    internalValue(val) {
      if (val === this.value) return;

      this.$emit('input', this.internalValue);
      this.$emit('change');
    },
  },

  methods: {
    formatDate,
  },
});
</script>

<style scoped></style>
