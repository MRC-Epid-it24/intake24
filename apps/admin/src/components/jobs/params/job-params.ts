import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { TaskRefs } from '@intake24/common/types/http/admin';

export default <T>() =>
  defineComponent({
    name: 'JobParams',

    props: {
      error: {
        type: String,
      },
      refs: {
        type: Object as PropType<TaskRefs>,
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

    methods: {
      input(key: string, value: any) {
        this.$emit('input', { ...this.value, [key]: value });
      },
    },
  });
