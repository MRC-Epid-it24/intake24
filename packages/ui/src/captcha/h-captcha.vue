<template>
  <v-card-text class="pa-6 text-caption">
    <vue-hcaptcha
      :sitekey="sitekey"
      ref="captcha"
      size="invisible"
      @verify="verified"
      @expired="expired"
      @challengeExpired="expired"
    >
    </vue-hcaptcha>
    This site is protected by <a href="https://hCaptcha.com" target="_blank">hCaptcha</a>
    and its
    <a href="https://hcaptcha.com/privacy" target="_blank">Privacy Policy</a> and
    <a href="https://hcaptcha.com/terms" target="_blank">Terms of Service</a>
    apply.
  </v-card-text>
</template>

<script lang="ts">
import VueHcaptcha from '@hcaptcha/vue-hcaptcha';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'HCaptcha',

  components: { VueHcaptcha },

  props: {
    sitekey: {
      type: String,
      required: true,
    },
  },

  setup() {
    const captcha = ref<InstanceType<typeof VueHcaptcha>>();

    return { captcha };
  },

  methods: {
    execute() {
      this.captcha?.execute();
    },

    reset() {
      this.captcha?.reset();
    },

    expired() {
      this.$emit('expired');
      this.reset();
    },

    async verified(token: string /*, eKey: string*/) {
      this.$emit('verified', token);
    },
  },
});
</script>

<style lang="scss"></style>
