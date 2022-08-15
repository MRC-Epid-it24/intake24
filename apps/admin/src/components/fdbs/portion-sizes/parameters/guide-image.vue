<template>
  <v-row>
    <v-col cols="12">
      <select-resource resource="guide-images" v-model="guideImageId">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs"
            v-on="on"
            :label="$t('fdbs.portionSizes.methods.guide-image._')"
            :value="guideImageId"
            hide-details="auto"
            name="guide-image-id"
            prepend-inner-icon="fas fa-image"
            outlined
            readonly
          ></v-text-field>
        </template>
      </select-resource>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import selectsResource from './selectsResource';

export default defineComponent({
  name: 'GuideImageParameters',

  mixins: [selectsResource],

  computed: {
    guideImageId: {
      get(): string | undefined {
        return this.getParameter('guide-image-id')?.value;
      },
      set(value: string) {
        this.setParameter('guide-image-id', value);
      },
    },
  },
});
</script>
