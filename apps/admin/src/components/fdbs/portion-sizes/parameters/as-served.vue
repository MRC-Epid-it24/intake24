<template>
  <v-list subheader>
    <v-subheader>
      {{ $t('fdbs.portionSizeMethods.methods.as-served._') }}
      {{ $t('fdbs.portionSizeMethods.methods.parameters') }}
    </v-subheader>
    <v-list-item link>
      <v-list-item-content>
        {{ $t('fdbs.portionSizeMethods.methods.as-served.servingImageSet') }}
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
    <v-list-item>
      <v-list-item-content>
        {{ $t('fdbs.portionSizeMethods.methods.as-served.leftoverImageSet') }}
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
          :title="$t('fdbs.portionSizeMethods.methods.as-served.removeLeftoverImageSet')"
          @click.stop="removeLeftoverImageSet"
        >
          <v-icon>$cancel</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type { AsServedImagesResponse } from '@intake24/common/types/http/admin';

import type { PortionSizeMethodParameterItem } from '..';
import SelectResourceDialog from '../select-resource-dialog.vue';

export default defineComponent({
  name: 'AsServedParameters',

  props: {
    value: {
      type: Array as PropType<PortionSizeMethodParameterItem[]>,
      required: true,
    },
  },

  components: { SelectResourceDialog },

  data() {
    return { items: [...this.value] };
  },

  computed: {
    selectedServingSet(): string | undefined {
      return this.items.find((item) => item.name === 'serving-image-set')?.value;
    },
    selectedLeftoverSet(): string | undefined {
      return this.items.find((item) => item.name === 'leftovers-image-set')?.value;
    },
  },

  watch: {
    value(val) {
      if (isEqual(val, this.items)) return;

      this.items = [...val];
    },
    items() {
      this.$emit('input', this.items);
    },
  },

  methods: {
    setServingImageSet(image: AsServedImagesResponse['data'][number]) {
      this.setImageSet(image, 'serving-image-set');
    },
    setLeftoverImageSet(image: AsServedImagesResponse['data'][number]) {
      this.setImageSet(image, 'leftovers-image-set');
    },
    setImageSet(
      image: AsServedImagesResponse['data'][number],
      name: 'serving-image-set' | 'leftovers-image-set'
    ) {
      const imageSet = this.items.find((item) => item.name === name);
      if (imageSet) {
        imageSet.value = image.id;
        return;
      }

      this.items.push({ name, value: image.id });
    },
    removeLeftoverImageSet() {
      if (!this.selectedLeftoverSet) return;

      this.items = this.items.filter((item) => item.name !== 'leftovers-image-set');
    },
  },
});
</script>
