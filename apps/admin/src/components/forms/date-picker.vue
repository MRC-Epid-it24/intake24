<template>
  <v-dialog ref="menu" v-model="menu" persistent :return-value.sync="internalValue" width="290px">
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="internalValue"
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
      <v-btn class="font-weight-medium" color="error" text @click="menu = false">
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DatePicker',

  props: {
    clearable: {
      type: Boolean,
    },
    errorMessages: {
      type: [String, Array as () => string[]],
    },
    label: {
      type: String,
    },
    value: {
      // type: String,
    },
  },

  /* setup() {
    const menu = ref<InstanceType<typeof VMenu>>();

    return { menu };
  }, */

  data() {
    return {
      menu: false,
      internalValue: this.value,
    };
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
});
</script>

<style scoped></style>
