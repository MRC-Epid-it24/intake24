<template>
  <component :is="tag" v-if="errors.length">
    <v-alert v-for="error in errors" :key="error.path" class="my-2" density="compact" type="error">
      {{ error.msg }}
    </v-alert>
  </component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { VCardText } from 'vuetify/components';

import type { ValidationError } from '@intake24/common/util';

export default defineComponent({
  name: 'ErrorList',

  components: { VCardText },

  props: {
    errors: {
      type: Array as PropType<ValidationError[]>,
      required: true,
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
});
</script>

<style lang="scss" scoped></style>
