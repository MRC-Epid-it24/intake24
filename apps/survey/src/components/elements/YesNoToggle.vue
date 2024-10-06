<template>
  <v-btn-toggle
    class="bg-grey-lighten-4"
    color="primary"
    divided
    :mandatory="mandatory && modelValue !== undefined"
    :model-value="modelValue"
    variant="outlined"
    @update:model-value="change"
  >
    <v-btn class="px-10 flex-grow-1 flex-md-grow-0" :title="$t('common.action.no')" :value="false">
      <v-icon :color="modelValue === false ? 'primary' : 'secondary '" start>
        $no
      </v-icon>
      {{ $t('common.action.no') }}
    </v-btn>
    <v-btn class="px-10 flex-grow-1 flex-md-grow-0" :title="$t('common.action.yes')" :value="true">
      <v-icon :color="modelValue === true ? 'primary' : 'secondary '" start>
        $yes
      </v-icon>
      {{ $t('common.action.yes') }}
    </v-btn>
  </v-btn-toggle>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'YesNoToggle',

  props: {
    mandatory: {
      type: Boolean,
    },
    modelValue: {
      type: Boolean,
    },
  },

  emits: ['update:modelValue', 'change'],

  methods: {
    change(event?: boolean) {
      this.$emit('update:modelValue', event);
      this.$emit('change', event);
    },
  },
});
</script>

<style></style>
