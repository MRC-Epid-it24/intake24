<template>
  <v-row>
    <v-col>
      <div class="guides-drawer">
        <v-img
          ref="imgGuide"
          v-resize="onImgResize"
          :src="
            guideImageApiResponse.baseImageUrl.replace(
              'http://localhost:3100',
              'https://api.intake24.org'
            )
          "
        >
          <template #placeholder>
            <image-placeholder></image-placeholder>
          </template>
        </v-img>
        <svg ref="svg" :height="height" :width="width">
          <polygon
            v-for="(polygon, idx) in polygons"
            :key="idx"
            class="guides-drawer-polygon"
            :class="{ active: idx === selectedIndex }"
            :points="polygon"
            @click.stop="$emit('guide-object', idx)"
            @keypress.stop="$emit('guide-object', idx)"
          ></polygon>
        </svg>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VImg } from 'vuetify/lib';
import chunk from 'lodash/chunk';
import debounce from 'lodash/debounce';
import { defineComponent, ref } from 'vue';
import { Resize } from 'vuetify/lib/directives';

import type { ImageMapResponse } from '@intake24/common/types/http';
import ImagePlaceholder from '@intake24/survey/components/elements/ImagePlaceholder.vue';

export default defineComponent({
  name: 'GuideImagePanel',

  directives: { Resize },

  components: { ImagePlaceholder },

  props: {
    guideImageApiResponse: {
      type: Object as PropType<ImageMapResponse>,
      required: true,
    },
    selectedIndex: {
      type: Number,
      required: true,
    },
  },

  setup() {
    const imgGuide = ref<InstanceType<typeof VImg>>();
    const svg = ref<SVGElement>();

    return { imgGuide, svg };
  },

  data() {
    const guideImageData = this.guideImageApiResponse;

    return {
      height: 0,
      width: 0,
      guideImageData,
    };
  },

  computed: {
    dataLoaded(): boolean {
      return !!Object.keys(this.guideImageData).length;
    },
    polygons(): string[] {
      if (!this.dataLoaded) return [];

      const { width } = this;

      return this.guideImageData.objects.map((object) => {
        return chunk(
          object.outline.map((coord) => coord * width),
          2
        )
          .map((node) => node.join(','))
          .join(' ');
      });
    },
  },

  created() {
    this.debouncedGuideImgResize = debounce(() => {
      this.updateSvgDimensions();
    }, 500);
  },

  methods: {
    onImgResize() {
      //@ts-expect-error fix debounced types
      this.debouncedGuideImgResize();
    },

    updateSvgDimensions() {
      const el = this.imgGuide?.$el;
      if (!el) {
        console.warn(`GuideImagePanel: could not update SVG dimensions.`);
        return;
      }
      const { width, height } = el.getBoundingClientRect();
      this.width = width;
      this.height = height;
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
