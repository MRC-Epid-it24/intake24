<template>
  <v-alert
    border="start"
    class="undoAlert ma-0"
    closable
    color="grey"
    elevation="5"
    type="info"
    :value="alert"
  >
    <span>{{ info }}</span>
  </v-alert>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InfoAlert',

  props: {
    info: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['alertDismissed'],

  data() {
    return {
      alert: false,
    };
  },

  watch: {
    status(value) {
      if (value === true) {
        this.alert = true;
        setTimeout(() => {
          this.alert = false;
          this.$emit('alertDismissed');
        }, 5000);
      }
      else {
        this.alert = false;
      }
    },
  },
});
</script>

<style scoped>
.undoAlert {
  position: absolute;
  z-index: 10;
  top: 1rem;
  width: 80%;
  max-width: 300px;
}
</style>
>
