import type { PropType } from 'vue';
import type { Location } from 'vue-router';
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
    title: {
      type: String,
    },
    to: {
      type: Object as PropType<Location>,
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
    internalTitle(): string {
      return this.title ?? this.$t(`common.action.${this.action}`).toString();
    },
    internalTo(): Location {
      const { to } = this;
      if (to) return to;

      const {
        action,
        item: { id },
        route,
      } = this;

      return { name: `${route}-${action}`, params: { id } };
    },
  },

  methods: {
    onClick() {
      this.$emit('action', this.action);
    },
  },
});
