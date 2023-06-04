<template>
  <v-row class="mt-3" :justify="justify">
    <v-col cols="12" lg="3" md="4" sm="6">
      <v-btn
        block
        :color="color"
        :disabled="disabled || isAppLoading"
        :title="label"
        type="submit"
        x-large
      >
        <v-icon left>{{ icon }}</v-icon>
        {{ label }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
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
