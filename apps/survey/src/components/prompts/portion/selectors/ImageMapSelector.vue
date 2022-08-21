<template>
  <div v-if="dataLoaded" class="guides-drawer">
    <v-img ref="img" v-resize="onImgResize" :src="imageMapData.baseImageUrl"> </v-img>
    <svg ref="svg" :height="height" :width="width">
      <polygon
        v-for="(polygon, idx) in polygons"
        :key="idx"
        class="guides-drawer-polygon"
        :class="{ active: idx === selectedIdx }"
        :points="polygon"
        @click.stop="selectObject(idx)"
        @keypress.stop="selectObject(idx)"
      ></polygon>
    </svg>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VImg } from 'vuetify/lib';
import chunk from 'lodash/chunk';
import debounce from 'lodash/debounce';
import { defineComponent, ref } from 'vue';

import type { ImageMapSelectorProps } from '@intake24/common/prompts';
import type { ImageMapResponse } from '@intake24/common/types/http';
import type { ImageMapEmit } from '@intake24/common/types/http/foods';
import { imageMapSelectorDefaultProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { localeContent } from '@intake24/survey/components/mixins';

import BasePortion from '../BasePortion';

export default defineComponent({
  name: 'ImageMapSelector',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<ImageMapSelectorProps>,
      required: true,
    },
  },

  setup() {
    const img = ref<InstanceType<typeof VImg>>();
    const svg = ref<SVGElement>();

    return { img, svg };
  },

  data() {
    return {
      ...merge(imageMapSelectorDefaultProps, this.promptProps),
      errors: [] as string[],
      imageMapData: {} as ImageMapResponse,
      width: 0,
      height: 0,
      selectedIdx: null as number | null,
    };
  },

  computed: {
    hasErrors(): boolean {
      return !!this.errors.length;
    },

    dataLoaded(): boolean {
      return !!Object.keys(this.imageMapData).length;
    },
    polygons(): string[] {
      if (!this.dataLoaded) return [];

      const { width } = this;

      return this.imageMapData.objects.map((object) => {
        return chunk(
          object.outline.map((coord) => coord * width),
          2
        )
          .map((node) => node.join(','))
          .join(' ');
      });
    },
  },

  // Appears to be a bug where $refs can't be found in PortionTest. Likely not an issue in production
  created() {
    this.debouncedImgResize = debounce(() => {
      this.updateSvgDimensions();
    }, 500);
  },

  mounted() {
    this.fetchImageMap();
  },

  methods: {
    async fetchImageMap() {
      try {
        const { data } = await this.$http.get<ImageMapResponse>(
          `portion-sizes/image-maps/${this.imageMapId}`
        );
        this.imageMapData = { ...data };
      } catch (e) {
        console.log(e);
      }
    },
    updateSvgDimensions() {
      const el = this.img?.$el;
      if (!el) {
        console.warn(`GuideImagePrompt: could not update SVG dimensions.`);
        return;
      }

      const { width, height } = el.getBoundingClientRect();
      this.width = width;
      this.height = height;
    },
    onImgResize() {
      //@ts-expect-error fix debounced types
      this.debouncedImgResize();
    },
    selectObject(idx: number) {
      this.selectedIdx = idx;
      this.$emit('image-map-selector-submit', {
        selectedIdx: this.selectedIdx,
      } as ImageMapEmit);
    },
  },
});
</script>

<style lang="scss" scoped>
.guides-drawer {
  position: relative;

  svg {
    position: absolute;
    top: 0;
    left: 0;

    .guides-drawer-polygon {
      cursor: pointer;
      fill: transparent;

      &.active,
      &:hover {
        fill: #0d47a1;
        fill-opacity: 0.4;
        stroke-width: 8;
        stroke: #0d47a1;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-opacity: 0.5;
      }
    }
  }
}
</style>
