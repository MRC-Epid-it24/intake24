<template>
  <v-alert
    class="undoAlert ma-0"
    elevation="5"
    border="left"
    color="grey"
    dismissible
    type="info"
    :value="alert"
    transition="slide-x-transition"
  >
    <span>{{ info }}</span>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'InfoAlert',

  props: {
    info: String,
    status: Boolean,
  },

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
      } else {
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
