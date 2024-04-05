<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        hide-details="auto"
        :items="properties"
        :label="$t('survey-schemes.conditions.properties._')"
        outlined
        :value="name"
        @change="update('name', $event)"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useSelects } from '@intake24/admin/composables';

export default defineComponent({
  name: 'PropertyProps',

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { properties } = useSelects();

    const update = (field: string, value: any) => {
      emit(`update:${field}`, value);
    };

    return { properties, update };
  },
});
</script>

<style lang="scss" scoped></style>
