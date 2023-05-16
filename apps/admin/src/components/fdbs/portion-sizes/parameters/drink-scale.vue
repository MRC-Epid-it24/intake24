<template>
  <v-row>
    <v-col cols="12">
      <select-resource v-model="drinkwareSetId" item-name="id" resource="drinkware-sets">
        <template #activator="{ attrs, on }">
          <v-text-field
            v-bind="attrs"
            hide-details="auto"
            :label="$t('fdbs.portionSizes.methods.drink-scale.drinkwareSet')"
            name="drinkware-set-id"
            outlined
            prepend-inner-icon="$drinkware-sets"
            readonly
            :value="drinkwareSetId"
            v-on="on"
          ></v-text-field>
        </template>
      </select-resource>
    </v-col>
    <v-col cols="12"
      ><v-slider
        v-model="initialFillLevel"
        class="mt-5"
        :label="$t('fdbs.portionSizes.methods.drink-scale.initialLevel')"
        :max="1"
        :min="0"
        :step="0.05"
        thumb-label="always"
      ></v-slider>
    </v-col>
    <v-col cols="12">
      <v-switch
        v-model="skipFillLevel"
        hide-details="auto"
        :label="$t('fdbs.portionSizes.methods.drink-scale.skipFillLevelPrompt')"
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
