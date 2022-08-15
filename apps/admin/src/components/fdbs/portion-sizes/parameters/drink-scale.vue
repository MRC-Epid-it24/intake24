<template>
  <div>
    <v-list>
      <v-list-item link>
        <v-list-item-content>
          {{ $t('fdbs.portionSizes.methods.drink-scale.drinkwareSet') }}
        </v-list-item-content>
        <v-list-item-action>
          <select-resource-dialog resource="drinkware-sets" @add="setDrinkwareSet">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" link text :title="$t('common.search._')">
                <v-icon left>fas fa-mug-saucer</v-icon>
                {{ selectedDrinkwareSet ?? $t('common.not.selected') }}
              </v-btn>
            </template>
          </select-resource-dialog>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-container>
      <v-row>
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
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { DrinkwareSetsResponse } from '@intake24/common/types/http/admin';

import selectsResource from './selectsResource';

export default defineComponent({
  name: 'DrinkScaleParameters',

  mixins: [selectsResource],

  computed: {
    selectedDrinkwareSet(): string | undefined {
      return this.items.find((item) => item.name === 'drinkware-id')?.value;
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

  methods: {
    setDrinkwareSet(drinkwareSet: DrinkwareSetsResponse['data'][number]) {
      this.setParameter('drinkware-id', drinkwareSet.id);
    },
  },
});
</script>
