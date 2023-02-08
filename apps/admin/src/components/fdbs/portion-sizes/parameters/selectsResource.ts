import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';

import { SelectResource } from '@intake24/admin/components/dialogs';

import type { PortionSizeMethodParameterItem } from '..';

export default defineComponent({
  name: 'SelectsResource',

  components: { SelectResource },

  props: {
    value: {
      type: Array as PropType<PortionSizeMethodParameterItem[]>,
      required: true,
    },
  },

  emits: ['input'],

  data() {
    return { items: [...this.value] };
  },

  watch: {
    value(val) {
      if (deepEqual(val, this.items)) return;

      this.items = [...val];
    },
    items() {
      this.$emit('input', this.items);
    },
  },

  methods: {
    getParameter(name: string) {
      return this.items.find((item) => item.name === name);
    },
    setParameter(name: string, value: string) {
      const item = this.items.find((item) => item.name === name);
      if (item) {
        item.value = value;
        return;
      }

      this.items.push({ name, value });
    },
    removeParameter(name: string) {
      this.items = this.items.filter((item) => item.name !== name);
    },
  },
});
