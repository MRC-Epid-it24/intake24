import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    action: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: true,
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
