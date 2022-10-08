<template>
  <v-row>
    <v-col>
      <div class="guides-drawer">
        <v-img ref="img" v-resize="onImgResize" :src="imageMapData.baseImageUrl">
          <template #placeholder>
            <image-placeholder></image-placeholder>
          </template>
        </v-img>
        <svg ref="svg" v-bind="{ height, width }">
          <polygon
            v-for="(polygon, idx) in polygons"
            :key="idx"
            class="guides-drawer-polygon"
            :class="{ active: idx === value }"
            :points="polygon"
            @click.stop="$emit('input', idx)"
            @keypress.stop="$emit('input', idx)"
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

import type { ImageMapResponse } from '@intake24/common/types/http';
import { ImagePlaceholder } from '@intake24/survey/components/elements';

export default defineComponent({
  name: 'ImageMapSelector',

  components: { ImagePlaceholder },

  props: {
    imageMapData: {
      type: Object as PropType<ImageMapResponse>,
      required: true,
    },
    value: {
      type: Number,
    },
  },

  setup() {
    const img = ref<InstanceType<typeof VImg>>();
    const svg = ref<SVGElement>();

    return { img, svg };
  },

  data() {
    return {
      height: 0,
      width: 0,
    };
  },

  computed: {
    polygons(): string[] {
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
      const el = this.img?.$el;
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
