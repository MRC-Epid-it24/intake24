<template>
  <v-row>
    <v-col cols="12">
      <select-resource v-model="servingSetId" item-name="id" resource="as-served-sets">
        <template #activator="{ attrs, on }">
          <v-text-field
            v-bind="attrs"
            hide-details="auto"
            :label="$t('fdbs.portionSizes.methods.as-served.servingImageSet')"
            name="serving-set-id"
            outlined
            prepend-inner-icon="fas fa-image"
            readonly
            :value="servingSetId"
            v-on="on"
          ></v-text-field>
        </template>
      </select-resource>
    </v-col>
    <v-col cols="12">
      <select-resource v-model="leftoverSetId" item-name="id" resource="as-served-sets">
        <template #activator="{ attrs, on }">
          <v-text-field
            v-bind="attrs"
            clearable
            hide-details="auto"
            item-name="description"
            :label="$t('fdbs.portionSizes.methods.as-served.leftoverImageSet')"
            list-name="id"
            name="leftover-set-id"
            outlined
            prepend-inner-icon="fas fa-image"
            readonly
            :value="leftoverSetId"
            v-on="on"
            @click:clear="removeParameter('leftovers-image-set')"
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
  name: 'AsServedParameters',

  mixins: [selectsResource],

  computed: {
    servingSetId: {
      get(): string | undefined {
        return this.getParameter('serving-image-set')?.value;
      },
      set(value: string) {
        this.setParameter('serving-image-set', value);
      },
    },
    leftoverSetId: {
      get(): string | undefined {
        return this.getParameter('leftovers-image-set')?.value;
      },
      set(value: string) {
        this.setParameter('leftovers-image-set', value);
      },
    },
  },
});
</script>
