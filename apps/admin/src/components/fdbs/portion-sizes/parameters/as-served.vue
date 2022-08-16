<template>
  <v-row>
    <v-col cols="12">
      <select-resource v-model="servingSetId" itemName="description" resource="as-served-sets">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs"
            v-on="on"
            :label="$t('fdbs.portionSizes.methods.as-served.servingImageSet')"
            :value="servingSetId"
            hide-details="auto"
            name="serving-set-id"
            prepend-inner-icon="fas fa-image"
            outlined
            readonly
          ></v-text-field>
        </template>
      </select-resource>
    </v-col>
    <v-col cols="12">
      <select-resource resource="as-served-sets" v-model="leftoverSetId">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs"
            v-on="on"
            :label="$t('fdbs.portionSizes.methods.as-served.leftoverImageSet')"
            :value="leftoverSetId"
            clearable
            hide-details="auto"
            itemName="description"
            listName="id"
            name="leftover-set-id"
            prepend-inner-icon="fas fa-image"
            outlined
            readonly
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
