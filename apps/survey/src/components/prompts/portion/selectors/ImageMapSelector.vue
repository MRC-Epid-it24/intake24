<template>
  <v-row>
    <v-col cols="12">
      <div class="guide-drawer">
        <v-img ref="img" v-resize="onImgResize" :src="imageMapData.baseImageUrl">
          <template #placeholder>
            <image-placeholder></image-placeholder>
          </template>
        </v-img>
        <div v-if="size" class="size">
          <v-chip class="font-weight-medium">{{ size }}</v-chip>
        </div>
        <div class="label">
          <slot name="label"></slot>
          <pinch-zoom-image-map-selector
            v-if="config.pinchZoom && isMobile"
            v-bind="{
              id,
              index,
              imageMapData,
              sizes,
              height: screenHeight,
              width: screenWidth,
            }"
            @confirm="confirm"
            @select="select"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                class="ma-2 font-weight-medium"
                color="grey darken-3"
                dark
                icon
                link
                :title="$t(`prompts.guide-image.expand`)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon aria-hidden="false" :aria-label="$t(`prompts.guide-image.expand`)">
                  $expandImage
                </v-icon>
              </v-btn>
            </template>
          </pinch-zoom-image-map-selector>
        </div>
        <svg ref="svg">
          <polygon
            v-for="(object, idx) in objects"
            :key="idx"
            class="guide-drawer-polygon"
            :class="{ active: idx === index }"
            :points="object.polygon"
            @click.stop="select(idx, object.id)"
            @keypress.stop="select(idx, object.id)"
            @mouseleave="hoverIndex = undefined"
            @mouseover="hoverIndex = idx"
          ></polygon>
        </svg>
      </div>
    </v-col>
    <v-col v-if="isMobile" cols="12" sm="auto">
      <v-btn :block="isMobile" color="success" :disabled="isDisabled" @click="confirm">
        {{ $t('common.action.continue') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VImg } from 'vuetify/lib';
import chunk from 'lodash/chunk';
import debounce from 'lodash/debounce';
import { defineComponent, ref } from 'vue';

import type { ImageMap } from '@intake24/common/prompts';
import type { ImageMapResponse } from '@intake24/common/types/http';
import { ImagePlaceholder } from '@intake24/survey/components/elements';

import PinchZoomImageMapSelector from './PinchZoomImageMapSelector.vue';

export type ImageMapObject = {
  id: string;
  polygon: string;
};

export default defineComponent({
  name: 'ImageMapSelector',

  components: { PinchZoomImageMapSelector, ImagePlaceholder },

  props: {
    config: {
      type: Object as PropType<ImageMap>,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
    id: {
      type: String,
    },
    index: {
      type: Number,
    },
    imageMapData: {
      type: Object as PropType<ImageMapResponse>,
      required: true,
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },

  setup() {
    const img = ref<InstanceType<typeof VImg>>();
    const svg = ref<SVGElement>();

    const hoverIndex = ref<number | undefined>(undefined);

    return { img, svg, hoverIndex };
  },

  data() {
    return {
      height: 0,
      width: 0,
      screenHeight: 0,
      screenWidth: 0,
    };
  },

  computed: {
    isDisabled() {
      return this.disabled || this.index === undefined;
    },

    hasLabelSlot(): boolean {
      return !!this.$slots.label;
    },

    objects(): ImageMapObject[] {
      const { width } = this;

      return this.imageMapData.objects.map((object) => ({
        id: object.id,
        polygon: chunk(
          object.outline.map((coord) => coord * width),
          2
        )
          .map((node) => node.join(','))
          .join(' '),
      }));
    },

    size(): string | undefined {
      if (
        !this.config.labels ||
        !this.sizes.length ||
        (this.hoverIndex === undefined && this.index === undefined)
      )
        return undefined;

      const idx = this.hoverIndex ?? this.index;
      if (idx === undefined) return undefined;

      return this.sizes[idx];
    },
  },

  created() {
    //@ts-expect-error fix debounced types
    this.debouncedGuideImgResize = debounce(() => {
      this.updateSvgDimensions();
    }, 500);
  },

  mounted() {
    this.getScreenDimensions();
  },

  methods: {
    getScreenDimensions() {
      const { height, width } = window.screen;
      this.screenHeight = height;
      this.screenWidth = width;
    },

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

    select(idx: number, id: string) {
      this.$emit('select', idx, id);

      if (!this.isMobile) this.confirm();
    },

    confirm() {
      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss">
.guide-drawer {
  position: relative;

  .label {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 2;
  }

  .size {
    position: absolute;
    top: 2%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%);
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;

    .guide-drawer-polygon {
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
