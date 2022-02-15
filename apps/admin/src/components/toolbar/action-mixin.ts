import { defineComponent } from '@vue/composition-api';

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
    selected: {
      type: Array,
    },
    routePrefix: {
      type: String,
    },
  },

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
