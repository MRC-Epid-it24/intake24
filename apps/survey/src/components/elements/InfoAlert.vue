<template>
  <v-alert
    border="left"
    class="undoAlert ma-0"
    color="grey"
    dismissible
    elevation="5"
    transition="slide-x-transition"
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

  emits: ['alert-dismissed'],

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
          this.$emit('alert-dismissed');
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
