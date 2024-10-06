<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="currentValue.tagId"
        hide-details="auto"
        :label="$t('survey-schemes.conditions.tag.id')"
        variant="outlined"
        @change="update(currentValue)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-checkbox-btn v-model="currentValue.value" :label="$t('survey-schemes.conditions.tag.showIfSet')" @update:model-value="update(currentValue)" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';

import type { TagPropertyCheck } from '@intake24/common/prompts';

export default defineComponent({
  name: 'TagPropertyCheck',

  props: {
    modelValue: {
      type: Object as PropType<TagPropertyCheck>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const currentValue = ref(props.modelValue);

    const update = (value: TagPropertyCheck) => {
      emit('update:modelValue', value);
    };
    return { update, currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
