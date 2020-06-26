import Vue from 'vue';

export default Vue.extend({
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
    route(): string {
      return this.routePrefix ?? this.$route.name;
    },
  },

  methods: {
    onClick() {
      this.$emit('action', this.action);
    },
  },
});
