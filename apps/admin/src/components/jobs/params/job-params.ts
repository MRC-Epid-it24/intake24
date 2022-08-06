import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { JobTypeParams } from '@intake24/common/types';
import type { TaskRefs } from '@intake24/common/types/http/admin';

export default defineComponent({
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
      type: Object as PropType<JobTypeParams>,
      required: true,
    },
  },

  methods: {
    input(key: string, value: any) {
      this.$emit('input', { ...this.value, [key]: value });
    },
  },
});
