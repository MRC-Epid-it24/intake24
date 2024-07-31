<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="currentValue.tagId"
        hide-details="auto"
        :label="$t('survey-schemes.conditions.tag.id')"
        outlined
        @change="update(currentValue)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-checkbox v-model="currentValue.value" :label="$t('survey-schemes.conditions.tag.showIfSet')" @change="update(currentValue)" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';

import type { TagPropertyCheck } from '@intake24/common/prompts';

export default defineComponent({
  name: 'TagPropertyCheck',

  props: {
    value: {
      type: Object as PropType<TagPropertyCheck>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const currentValue = ref(props.value);

    const update = (value: TagPropertyCheck) => {
      emit('update:value', value);
    };
    return { update, currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
