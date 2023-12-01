import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Errors } from '@intake24/common/util';

export default <T>() =>
  defineComponent({
    name: 'JobParams',

    props: {
      errors: {
        type: Object as PropType<Errors>,
        required: true,
      },
      value: {
        type: Object as PropType<T>,
        required: true,
      },
      disabled: {
        type: Object as PropType<Record<keyof T, boolean>>,
        default: () => ({}),
      },
    },

    emits: ['input'],

    computed: {
      params: {
        get() {
          return this.value;
        },
        set(value: T) {
          this.$emit('input', value);
        },
      },
    },
  });
