<template>
  <v-card-text class="pa-6 text-caption">
    <vue-recaptcha
      ref="captcha"
      :sitekey="sitekey"
      size="invisible"
      @expired="expired"
      @verify="verified"
    >
    </vue-recaptcha>
    This site is protected by
    <a href="https://www.google.com/recaptcha" target="_blank">reCAPTCHA</a>
    and Google
    <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and
    <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a>
    apply.
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueRecaptcha from 'vue-recaptcha';

export default defineComponent({
  name: 'ReCaptcha',

  components: { VueRecaptcha },

  props: {
    sitekey: {
      type: String,
      required: true,
    },
  },

  setup() {
    const captcha = ref<InstanceType<typeof VueRecaptcha>>();

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

    async verified(token: string) {
      this.$emit('verified', token);
    },
  },
});
</script>

<style lang="scss">
.grecaptcha-badge {
  visibility: hidden;
}
</style>
