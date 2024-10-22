<template>
  <div class="guides-drawer">
    <v-img ref="img" :src="entry.baseImageUrl" />
    <svg
      ref="svg"
      :style="svgCursor"
      @dblclick.stop="isGuideImage || disabled ? undefined : addNode($event)"
    >
      <g v-for="(object, objectIdx) in scaled" :key="objectIdx" class="guides-drawer-group">
        <polygon
          class="guides-drawer-polygon"
          :class="{ active: objectIdx === selectedObjectIdx }"
          :points="object.polygon"
          @click.stop="selectObject(objectIdx)"
          @keypress.stop="selectObject(objectIdx)"
        />
        <g v-if="isImageMap && !disabled" class="guides-drawer-node-group">
          <circle
            v-for="([x, y], nodeIdx) in object.coords"
            :key="nodeIdx"
            class="guides-drawer-node"
            :cx="x"
            :cy="y"
            :style="nodeCursor"
            @dblclick.stop="removeNode(nodeIdx)"
            @mousedown="dragNode($event, nodeIdx)"
            @mouseup="dropNode()"
          />
        </g>
      </g>
    </svg>
    <v-item-group v-model="selectedObjectIdx">
      <v-container fluid>
        <v-row>
          <v-col v-for="(object, idx) in objects" :key="object.id" cols="12" lg="4" sm="6">
            <v-item v-slot="{ isSelected }">
              <v-card border flat min-height="200px">
                <v-toolbar
                  :color="isSelected ? `primary` : `ternary`"
                  :dark="isSelected"
                  flat
                  :style="{ cursor: 'pointer' }"
                  @click="selectObject(idx)"
                >
                  <v-icon icon="fas fa-draw-polygon" start />{{ $t('guide-images.objects.id') }}:
                  {{ object.id }}
                  <v-spacer />
                  <confirm-dialog
                    v-if="isImageMap && !disabled"
                    color="error"
                    icon
                    :icon-color="isSelected ? `white` : `error`"
                    icon-left="$delete"
                    :label="$t('guide-images.objects.delete')"
                    variant="text"
                    @confirm="removeObject(idx)"
                  >
                    {{ $t('common.action.confirm.delete', { name: entry.id }) }}
                  </confirm-dialog>
                </v-toolbar>
                <v-divider />
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model.trim="object.description"
                        :disabled="isGuideImage || disabled"
                        hide-details="auto"
                        :label="$t('common.description')"
                        :name="`description-${object.id}`"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col v-if="isGuideImage" cols="12">
                      <v-text-field
                        v-model.number="object.weight"
                        :disabled="isImageMap || disabled"
                        hide-details="auto"
                        :label="$t('guide-images.objects.weight')"
                        :name="`weight-${object.id}`"
                        prepend-inner-icon="fas fa-scale-balanced"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12">
                      <language-selector
                        v-model="object.label"
                        border
                        :disabled="disabled"
                        :label="$t('guide-images.objects.label._')"
                      >
                        <template v-for="lang in Object.keys(object.label)" :key="lang" #[`lang.${lang}`]>
                          <v-text-field
                            v-model="object.label[lang]"
                            hide-details="auto"
                            :hint="isGuideImage ? $t('guide-images.objects.label.hint') : undefined"
                            :label="$t('guide-images.objects.label._')"
                            :persistent-hint="isGuideImage"
                            variant="outlined"
                            @update:model-value="updateObjects"
                          />
                        </template>
                      </language-selector>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-item>
          </v-col>
          <v-col v-if="isImageMap && !disabled" cols="12" lg="4" sm="6">
            <v-card
              border
              class="d-flex justify-center align-center"
              flat
              height="100%"
              link
              min-height="200px"
              :title="$t('guide-images.objects.add')"
              @click.stop="addObject"
            >
              <v-btn color="primary" icon="$add" size="x-large" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VImg } from 'vuetify/components';
import { useElementSize, watchDebounced } from '@vueuse/core';
import chunk from 'lodash/chunk';
import debounce from 'lodash/debounce';
import { computed, defineComponent, ref } from 'vue';

import { LanguageSelector } from '@intake24/admin/components/forms';
import { closestSegmentIndex } from '@intake24/admin/views/images/math-helpers';
import type {
  GuideImageEntry,
  GuideImageEntryObject,
  ImageMapEntry,
  ImageMapEntryObject,
} from '@intake24/common/types/http/admin';
import { ConfirmDialog } from '@intake24/ui';

interface Objects extends Omit<GuideImageEntryObject, 'id' | 'outlineCoordinates'> {
  id: number;
}

type PathCoords = number[][][];

function distance([sourceX, sourceY]: number[], [targetX, targetY]: number[]) {
  return Math.sqrt((sourceX - targetX) ** 2 + (sourceY - targetY) ** 2);
}

export default defineComponent({
  name: 'GuideDrawer',

  components: { ConfirmDialog, LanguageSelector },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    entry: {
      type: Object as PropType<GuideImageEntry | ImageMapEntry>,
      required: true,
    },
    resource: {
      type: String as PropType<'image-maps' | 'guide-images'>,
      required: true,
    },
  },

  emits: ['image-map-objects', 'guide-image-objects'],

  setup(props, { emit }) {
    const img = ref<InstanceType<typeof VImg>>();
    const svg = ref<SVGElement>();

    // @ts-expect-error should allow vue instance?
    const { height, width } = useElementSize(img);

    const objects = ref<Objects[]>([]);
    const coords = ref<PathCoords>([]);

    const selectedObjectIdx = ref<number | null>(null);
    const selectedNodeIdx = ref<number | null>(null);

    props.entry.objects.forEach(({ id, outlineCoordinates, ...rest }) => {
      coords.value.push(chunk(outlineCoordinates, 2));
      objects.value.push({ weight: 0, id: Number.parseInt(id, 10), ...rest });
    });

    const isImageMap = computed(() => props.resource === 'image-maps');
    const isGuideImage = computed(() => props.resource === 'guide-images');

    const svgCursor = computed(
      () => `cursor: ${props.disabled || selectedObjectIdx.value === null ? 'no-drop' : 'pointer'}`,
    );

    const nodeCursor = computed(
      () => `cursor: ${selectedNodeIdx.value === null ? 'grab' : 'grabbing'}`,
    );

    const scaled = computed(() => {
      return coords.value.map((node) => {
        const coords = node.map(([x, y]) => [x * width.value, y * width.value]);
        const polygon = coords.map(scaledNode => scaledNode.join(',')).join(' ');

        return { coords, polygon };
      });
    });

    const imageMapObjects = computed<ImageMapEntryObject[]>(() =>
      objects.value.map(({ id, weight, ...rest }, index) => ({
        ...rest,
        id: id.toString(),
        outlineCoordinates: coords.value[index].flat(),
      })),
    );

    const guideImageObjects = computed<GuideImageEntryObject[]>(() =>
      objects.value.map(({ id, ...rest }, index) => ({
        ...rest,
        id: id.toString(),
        outlineCoordinates: coords.value[index].flat(),
      })),
    );

    const updateImageMapObjects = () => {
      emit('image-map-objects', imageMapObjects.value);
    };

    const updateGuideImageObjects = () => {
      emit('guide-image-objects', guideImageObjects.value);
    };

    const updateObjects = debounce(() => {
      updateImageMapObjects();
      updateGuideImageObjects();
    }, 500);

    watchDebounced(
      imageMapObjects,
      () => {
        updateImageMapObjects();
      },
      { debounce: 500, maxWait: 2000 },
    );

    watchDebounced(
      guideImageObjects,
      () => {
        updateGuideImageObjects();
      },
      { debounce: 500, maxWait: 2000 },
    );

    return {
      img,
      svg,
      coords,
      isGuideImage,
      isImageMap,
      nodeCursor,
      objects,
      selectedNodeIdx,
      selectedObjectIdx,
      scaled,
      svgCursor,
      width,
      height,
      imageMapObjects,
      guideImageObjects,
      updateObjects,
    };
  },

  methods: {
    selectObject(idx: number) {
      this.selectedObjectIdx = idx;
    },

    addObject() {
      const nextId = this.objects.reduce((acc, { id }) => (acc < id ? id : acc), -1);
      this.coords.push([]);
      this.objects.push({
        id: nextId + 1,
        description: '',
        label: {},
        navigationIndex: nextId + 1,
        weight: 0,
      });
    },

    removeObject(index: number) {
      this.coords.splice(index, 1);
      this.objects.splice(index, 1);
    },

    getClosestPointIndex(source: number[], targets: number[][]): number {
      if (!targets.length)
        return 0;

      const closest = targets.reduce((a, b) => (distance(source, a) < distance(source, b) ? a : b));

      return targets.findIndex(coords => coords === closest);
    },

    addNode(event: any) {
      const { selectedObjectIdx } = this;
      if (selectedObjectIdx === null)
        return;

      const { width } = this;
      const { offsetX, offsetY } = event;
      const p: [number, number] = [offsetX / width, offsetY / width];

      const coords = this.coords[selectedObjectIdx] as [number, number][];

      const closestIndex = closestSegmentIndex(coords, p);
      const insertAt = (closestIndex + 1) % coords.length;
      coords.splice(insertAt, 0, p);
    },

    updateNode(objIdx: number, nodeIdx: number, [x, y]: number[]) {
      const { width } = this;

      this.coords[objIdx].splice(nodeIdx, 1, [x / width, y / width]);
    },

    removeNode(nodeIdx: number) {
      const { selectedObjectIdx } = this;
      if (selectedObjectIdx === null)
        return;

      this.coords[selectedObjectIdx].splice(nodeIdx, 1);
    },

    dragNode(event: any, index: number) {
      const { selectedObjectIdx } = this;
      if (selectedObjectIdx === null)
        return;

      this.selectedNodeIdx = index;

      const { offsetX, offsetY } = event;
      this.updateNode(selectedObjectIdx, index, [offsetX, offsetY]);
      this.svg?.addEventListener('mousemove', this.moveNode);
    },

    moveNode(event: any) {
      const { selectedObjectIdx, selectedNodeIdx } = this;
      if (selectedObjectIdx === null || selectedNodeIdx === null) {
        this.dropNode();
        return;
      }

      const { offsetX, offsetY } = event;
      this.updateNode(selectedObjectIdx, selectedNodeIdx, [offsetX, offsetY]);
    },

    dropNode() {
      this.selectedNodeIdx = null;
      this.svg?.removeEventListener('mousemove', this.moveNode);
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
    width: 100%;
    height: 100%;

    .guides-drawer-polygon {
      cursor: pointer;
      fill: transparent;
      stroke-width: 3;
      stroke: rgba(0, 0, 0);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-opacity: 0.8;

      &.active {
        fill: rgba(0, 0, 0, 0.4);
      }

      &:hover {
        fill: rgba(0, 0, 0, 0.5);
      }
    }

    .guides-drawer-node {
      fill: rgba(0, 0, 0);
      fill-opacity: 0.8;
      r: 5px;
    }
  }
}
</style>
