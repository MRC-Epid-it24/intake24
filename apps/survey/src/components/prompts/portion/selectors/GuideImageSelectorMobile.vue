<template>
  <v-bottom-sheet v-model="showMenu" persistent>
    <v-sheet class="text-center pa-3" :height="height">
      <v-row dense no-gutter>
        <v-col cols="12">
          <PinchScrollZoom
            ref="zoomer"
            class="guide-drawer"
            :height="height * 0.6"
            :scale="scale"
            style="border: 1px solid grey"
            :width="width * 0.95"
          >
            <img :src="imageMapData.baseImageUrl" :width="width" />
            <svg ref="svg" v-bind="{ height, width }">
              <polygon
                v-for="(polygon, idx) in polygons"
                :key="idx"
                class="guide-drawer-polygon"
                :class="{ active: idx === value }"
                :points="polygon"
                @click.stop="$emit('input', idx)"
                @keypress.stop="$emit('input', idx)"
              ></polygon>
            </svg>
          </PinchScrollZoom>
        </v-col>
        <v-col cols="12">
          <v-btn :block="isMobile" color="success" @click="confirm">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn :block="isMobile" @click="resetScale">
            {{ $t('common.action.reset') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import PinchScrollZoom from '@coddicat/vue-pinch-scroll-zoom';
import chunk from 'lodash/chunk';
import { defineComponent, ref } from 'vue';

import type { ImageMapResponse } from '@intake24/common/types/http';

export default defineComponent({
  name: 'GuideImageSelectorMobile',

  components: { PinchScrollZoom },

  props: {
    show: {
      type: Boolean,
      required: true,
      default: true,
    },
    imageMapData: {
      type: Object as PropType<ImageMapResponse>,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
    },
  },

  setup() {
    const zoomer = ref<InstanceType<typeof PinchScrollZoom>>();
    return {
      scale: 1,
      zoomer,
    };
  },

  computed: {
    showMenu(): boolean {
      return this.show;
    },

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

  methods: {
    resetScale() {
      (this.zoomer as PinchScrollZoom).setData({
        scale: 1,
        originX: 0,
        originY: 0,
        translateX: 0,
        translateY: 0,
      });
    },

    confirm() {
      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss" scoped>
.guide-drawer {
  position: relative;

  .label {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 2;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
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
