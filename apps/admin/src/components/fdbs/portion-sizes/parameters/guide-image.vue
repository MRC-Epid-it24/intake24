<template>
  <v-row>
    <v-col cols="12">
      <select-resource v-model="guideImageId" item-name="id" resource="guide-images">
        <template #activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs"
            hide-details="auto"
            :label="$t('fdbs.portionSizes.methods.guide-image._')"
            name="guide-image-id"
            outlined
            prepend-inner-icon="fas fa-image"
            readonly
            :value="guideImageId"
            v-on="on"
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
