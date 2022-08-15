<template>
  <v-list>
    <v-list-item link>
      <v-list-item-content>
        {{ $t('fdbs.portionSizes.methods.as-served.servingImageSet') }}
      </v-list-item-content>
      <v-list-item-action>
        <select-resource-dialog resource="as-served" @add="setServingImageSet">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" link text :title="$t('common.search._')">
              <v-icon left>fas fa-image</v-icon>
              {{ selectedServingSet ?? $t('common.not.selected') }}
            </v-btn>
          </template>
        </select-resource-dialog>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item link>
      <v-list-item-content>
        {{ $t('fdbs.portionSizes.methods.as-served.leftoverImageSet') }}
      </v-list-item-content>
      <v-list-item-action>
        <select-resource-dialog resource="as-served" @add="setLeftoverImageSet">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" link text :title="$t('common.search._')">
              <v-icon left>fas fa-image</v-icon>
              {{ selectedLeftoverSet ?? $t('common.not.selected') }}
            </v-btn>
          </template>
        </select-resource-dialog>
      </v-list-item-action>
      <v-list-item-action v-if="selectedLeftoverSet">
        <v-btn
          icon
          color="error"
          :title="$t('fdbs.portionSizes.methods.as-served.removeLeftoverImageSet')"
          @click.stop="removeLeftoverImageSet"
        >
          <v-icon>$cancel</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { AsServedImagesResponse } from '@intake24/common/types/http/admin';

import selectsResource from './selectsResource';

export default defineComponent({
  name: 'AsServedParameters',

  mixins: [selectsResource],

  computed: {
    selectedServingSet(): string | undefined {
      return this.items.find((item) => item.name === 'serving-image-set')?.value;
    },
    selectedLeftoverSet(): string | undefined {
      return this.items.find((item) => item.name === 'leftovers-image-set')?.value;
    },
  },

  methods: {
    setServingImageSet(image: AsServedImagesResponse['data'][number]) {
      this.setParameter('serving-image-set', image.id);
    },
    setLeftoverImageSet(image: AsServedImagesResponse['data'][number]) {
      this.setParameter('leftovers-image-set', image.id);
    },
    removeLeftoverImageSet() {
      if (!this.selectedLeftoverSet) return;

      this.removeParameter('leftovers-image-set');
    },
  },
});
</script>
