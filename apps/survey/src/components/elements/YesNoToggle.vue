<template>
  <v-btn-toggle
    class="d-flex"
    color="primary"
    :mandatory="mandatory && value !== undefined"
    :value="value"
    @change="change"
  >
    <v-btn class="px-10 flex-grow-1 flex-md-grow-0" :title="$t('common.action.no')" :value="false">
      <v-icon :color="value === false ? 'primary' : 'secondary '" left>
        $no
      </v-icon>
      {{ $t('common.action.no') }}
    </v-btn>
    <v-btn class="px-10 flex-grow-1 flex-md-grow-0" :title="$t('common.action.yes')" :value="true">
      <v-icon :color="value === true ? 'primary' : 'secondary '" left>
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
    value: {
      type: Boolean,
    },
  },

  emits: ['input', 'change'],

  methods: {
    change(event?: boolean) {
      this.$emit('input', event);
      this.$emit('change', event);
    },
  },
});
</script>

<style></style>
