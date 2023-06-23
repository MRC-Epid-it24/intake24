<template>
  <v-row>
    <v-col cols="12">
      <v-switch
        v-model="imageMapLabels"
        hide-details="auto"
        :label="$t('fdbs.portionSizes.methods.pizza.imageMapLabels')"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import selectsResource from './selectsResource';

export default defineComponent({
  name: 'PizzaParameters',

  mixins: [selectsResource],

  computed: {
    imageMapLabels: {
      get(): boolean {
        const value = this.getParameter('image-map-labels')?.value;
        return value === 'true';
      },
      set(value: boolean) {
        this.setParameter('image-map-labels', value.toString());
      },
    },
  },
});
</script>
