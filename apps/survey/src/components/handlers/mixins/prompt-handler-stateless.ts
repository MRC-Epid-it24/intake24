import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['valid'],

  data() {
    return {
      continueEnabled: false,
    };
  },

  mounted() {
    this.setValidationState(this.isValid());
    this.continueEnabled = this.isValid();
  },

  methods: {
    isValid(): boolean {
      throw new Error('isValid method must be defined in the main component');
    },

    setValidationState(valid: boolean) {
      this.continueEnabled = valid;
      this.$emit('valid', valid);
    },
  },
});
