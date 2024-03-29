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
    routePrefix: {
      type: String,
    },
  },

  emits: ['action'],

  computed: {
    icon(): string {
      return `$${this.action}`;
    },
    route(): string | null | undefined {
      return this.routePrefix ?? this.$route.name;
    },
  },

  methods: {
    onClick() {
      this.$emit('action', this.action);
    },
  },
});
