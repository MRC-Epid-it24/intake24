<template>
  <v-row>
    <v-col cols="12">
      <select-resource v-model="drinkwareSetId" itemName="description" resource="drinkware-sets">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs"
            v-on="on"
            :label="$t('fdbs.portionSizes.methods.drink-scale.drinkwareSet')"
            :value="drinkwareSetId"
            hide-details="auto"
            name="drinkware-set-id"
            prepend-inner-icon="fas fa-mug-saucer"
            outlined
            readonly
          ></v-text-field>
        </template>
      </select-resource>
    </v-col>
    <v-col cols="12"
      ><v-slider
        v-model="initialFillLevel"
        :label="$t('fdbs.portionSizes.methods.drink-scale.initialLevel')"
        :min="0"
        :max="1"
        :step="0.05"
        class="mt-5"
        thumb-label="always"
      ></v-slider>
    </v-col>
    <v-col cols="12">
      <v-switch
        v-model="skipFillLevel"
        :label="$t('fdbs.portionSizes.methods.drink-scale.skipFillLevelPrompt')"
        hide-details="auto"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import selectsResource from './selectsResource';

export default defineComponent({
  name: 'DrinkScaleParameters',

  mixins: [selectsResource],

  computed: {
    drinkwareSetId: {
      get(): string | undefined {
        return this.getParameter('drinkware-id')?.value;
      },
      set(value: string) {
        this.setParameter('drinkware-id', value);
      },
    },
    initialFillLevel: {
      get(): number {
        const value = parseFloat(this.getParameter('initial-fill-level')?.value ?? '0');
        return Number.isNaN(value) ? 0 : value;
      },
      set(value: number) {
        this.setParameter('initial-fill-level', value.toString());
      },
    },
    skipFillLevel: {
      get(): boolean {
        const value = this.getParameter('skip-fill-level')?.value;
        return value === 'true';
      },
      set(value: boolean) {
        this.setParameter('skip-fill-level', value.toString());
      },
    },
  },
});
</script>
