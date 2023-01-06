<template>
  <v-bottom-sheet v-model="dialog" persistent>
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }"></slot>
    </template>
    <v-sheet class="text-center pa-3" :heigh="height">
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
            <div v-if="size" class="size">
              <v-chip class="font-weight-medium">{{ size }}</v-chip>
            </div>
            <img :src="imageMapData.baseImageUrl" :width="width" />
            <svg ref="svg" v-bind="{ height, width }">
              <polygon
                v-for="(object, idx) in objects"
                :key="idx"
                class="guide-drawer-polygon"
                :class="{ active: idx === index }"
                :points="object.polygon"
                @click.stop="select(idx, object.id)"
                @keypress.stop="select(idx, object.id)"
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

export type ImageMapObject = {
  id: string;
  polygon: string;
};

export default defineComponent({
  name: 'PinchZoomImageMapSelector',

  components: { PinchScrollZoom },

  props: {
    id: {
      type: String,
    },
    index: {
      type: Number,
    },
    height: {
      type: Number,
      required: true,
    },
    imageMapData: {
      type: Object as PropType<ImageMapResponse>,
      required: true,
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    width: {
      type: Number,
      required: true,
    },
  },

  setup() {
    const dialog = ref(false);
    const zoomer = ref<InstanceType<typeof PinchScrollZoom>>();

    const hoverIndex = ref<number | undefined>(undefined);

    return {
      dialog,
      hoverIndex,
      scale: 1,
      zoomer,
    };
  },

  computed: {
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
      if (!this.sizes.length || (this.hoverIndex === undefined && this.index === undefined))
        return undefined;

      const idx = this.hoverIndex ?? this.index;
      if (idx === undefined) return undefined;

      return this.sizes[idx];
    },
  },

  methods: {
    resetScale() {
      this.zoomer?.setData({
        scale: 1,
        originX: 0,
        originY: 0,
        translateX: 0,
        translateY: 0,
      });
    },

    select(idx: number, id: string) {
      this.$emit('select', idx, id);
    },

    confirm() {
      this.dialog = false;
      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss" scoped></style>
