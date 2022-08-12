<template>
  <v-list subheader>
    <v-subheader>
      {{ $t('fdbs.portionSizeMethods.methods.guide-image._') }}
      {{ $t('fdbs.portionSizeMethods.methods.parameters') }}
    </v-subheader>
    <v-list-item link>
      <v-list-item-content>
        {{ $t('fdbs.portionSizeMethods.methods.guide-image._') }}
      </v-list-item-content>
      <v-list-item-action>
        <select-resource-dialog resource="guide-images" @add="setGuideImage">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" link text :title="$t('common.search._')">
              <v-icon left>fas fa-image</v-icon>
              {{ selectedGuideImage ?? $t('common.not.selected') }}
            </v-btn>
          </template>
        </select-resource-dialog>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type { GuideImagesResponse } from '@intake24/common/types/http/admin';

import type { PortionSizeMethodParameterItem } from '..';
import SelectResourceDialog from '../select-resource-dialog.vue';

export default defineComponent({
  name: 'GuideImageParameters',

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
    selectedGuideImage(): string | undefined {
      return this.items.find((item) => item.name === 'guide-image-id')?.value;
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
    setGuideImage(image: GuideImagesResponse['data'][number]) {
      const imageSet = this.items.find((item) => item.name === 'guide-image-id');
      if (imageSet) {
        imageSet.value = image.id;
        return;
      }

      this.items.push({ name: 'guide-image-id', value: image.id });
    },
  },
});
</script>
