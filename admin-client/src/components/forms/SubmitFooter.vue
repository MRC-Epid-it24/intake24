<template>
  <v-row :justify="justify" class="mt-3">
    <v-col cols="12" sm="6" md="4" lg="3">
      <v-btn
        x-large
        type="submit"
        :color="color"
        block
        :title="label"
        :disabled="disabled || isLoading"
      >
        <v-icon left>{{ icon }}</v-icon> {{ label }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SubmitFooter',

  props: {
    color: {
      type: String,
      default: 'secondary',
    },
    icon: {
      type: String,
      default: '$save',
    },
    justify: {
      type: String,
      default: 'center',
    },
    label: {
      type: String,
      default() {
        return this.$t('common.action.save');
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped></style>
