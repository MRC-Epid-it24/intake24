import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    action: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['action'],

  computed: {
    icon(): string {
      return `$${this.action}`;
    },
    route(): string | undefined {
      return this.$route.name?.toString();
    },
  },

  methods: {
    onClick() {
      this.$emit('action', this.action);
    },
  },
});
