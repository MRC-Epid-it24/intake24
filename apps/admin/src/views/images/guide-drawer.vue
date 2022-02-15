<template>
  <div class="guides-drawer">
    <v-img ref="img" v-resize="onImgResize" :src="entry.baseImageUrl"></v-img>
    <svg
      ref="svg"
      :height="height"
      :width="width"
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
        ></polygon>
        <g class="guides-drawer-node-group" v-if="isImageMap && !disabled">
          <circle
            v-for="([x, y], nodeIdx) in object.coords"
            :key="nodeIdx"
            :cx="x"
            :cy="y"
            :style="nodeCursor"
            class="guides-drawer-node"
            @dblclick.stop="removeNode(nodeIdx)"
            @mousedown="dragNode($event, nodeIdx)"
            @mouseup="dropNode()"
          ></circle>
        </g>
      </g>
    </svg>
    <v-item-group v-model="selectedObjectIdx">
      <v-container>
        <v-row>
          <v-col v-for="(object, idx) in objects" :key="object.id" cols="12" sm="6" md="4">
            <v-item v-slot="{ active }">
              <v-card min-height="200px" flat outlined>
                <v-toolbar
                  flat
                  :color="active ? `secondary` : `orange lighten-4`"
                  :dark="active"
                  :style="{ cursor: 'pointer' }"
                  @click="selectObject(idx)"
                >
                  <v-icon left>fa-draw-polygon</v-icon> {{ $t('guide-images.objects.id') }}:
                  {{ object.id }}
                  <v-spacer></v-spacer>
                  <confirm-dialog
                    v-if="isImageMap && !disabled"
                    :label="$t('guide-images.objects.delete')"
                    color="error"
                    icon
                    :icon-color="active ? `white` : `error`"
                    icon-left="$delete"
                    @confirm="removeObject(idx)"
                  >
                    {{ $t('common.action.confirm.delete', { name: entry.id }) }}
                  </confirm-dialog>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model.trim="object.description"
                        :disabled="isGuideImage || disabled"
                        :label="$t('common.description')"
                        hide-details="auto"
                        name="description"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" v-if="isGuideImage">
                      <v-text-field
                        v-model.number="object.weight"
                        :disabled="isImageMap || disabled"
                        :label="$t('guide-images.objects.weight')"
                        hide-details="auto"
                        name="weight"
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-item>
          </v-col>
          <v-col v-if="isImageMap && !disabled" cols="12" sm="6" md="4">
            <v-card
              :title="$t('guide-images.objects.add')"
              class="d-flex justify-center align-center"
              min-height="200px"
              height="100%"
              flat
              outlined
              link
              @click.stop="addObject"
            >
              <v-btn color="secondary" fab x-large>
                <v-icon>$add</v-icon>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor, PropType } from 'vue';
import {
  GuideImageEntry,
  GuideImageEntryObject,
  ImageMapEntry,
  ImageMapEntryObject,
} from '@intake24/common/types/http/admin';
import chunk from 'lodash/chunk';
import debounce from 'lodash/debounce';
import { VImg } from 'vuetify/lib';
import { ConfirmDialog } from '@intake24/ui';

type Refs = {
  $refs: {
    img: InstanceType<typeof VImg>;
    svg: SVGElement;
  };
  debouncedImgResize: () => void;
  debouncedImageMapObjects: () => void;
  debouncedGuideImageObjects: () => void;
};

interface Objects extends Omit<GuideImageEntryObject, 'id' | 'outlineCoordinates'> {
  id: number;
}

type PathCoords = number[][][];

const distance = ([sourceX, sourceY]: number[], [targetX, targetY]: number[]) =>
  Math.sqrt((sourceX - targetX) ** 2 + (sourceY - targetY) ** 2);

export default (Vue as VueConstructor<Vue & Refs>).extend({
  name: 'GuideDrawer',

  components: { ConfirmDialog },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    entry: {
      type: Object as PropType<GuideImageEntry | ImageMapEntry>,
      required: true,
    },
  },

  data() {
    const objects: Objects[] = [];
    const coords: PathCoords = [];

    this.entry.objects.forEach(({ id, outlineCoordinates, ...rest }) => {
      coords.push(chunk(outlineCoordinates, 2));
      objects.push({ weight: 0, id: parseInt(id, 10), ...rest });
    });

    return {
      objects,
      coords,
      width: 0,
      height: 0,
      selectedObjectIdx: null as number | null,
      selectedNodeIdx: null as number | null,
    };
  },

  computed: {
    isImageMap(): boolean {
      return this.module === 'image-maps';
    },

    isGuideImage(): boolean {
      return this.module === 'guide-images';
    },

    svgCursor(): string {
      return `cursor: ${this.disabled || this.selectedObjectIdx === null ? 'no-drop' : 'pointer'}`;
    },

    nodeCursor(): string {
      return `cursor: ${this.selectedNodeIdx === null ? 'grab' : 'grabbing'}`;
    },

    scaled(): { coords: number[][]; polygon: string }[] {
      const { width } = this;

      return this.coords.map((node) => {
        const coords = node.map(([x, y]) => [x * width, y * width]);
        const polygon = coords.map((scaledNode) => scaledNode.join(',')).join(' ');

        return {
          coords,
          polygon,
        };
      });
    },

    imageMapObjects(): ImageMapEntryObject[] {
      return this.objects.map(({ id, weight, ...rest }, index) => ({
        ...rest,
        id: id.toString(),
        outlineCoordinates: this.coords[index].flat(),
      }));
    },

    guideImageObjects(): GuideImageEntryObject[] {
      return this.objects.map(({ id, ...rest }, index) => ({
        ...rest,
        id: id.toString(),
        outlineCoordinates: this.coords[index].flat(),
      }));
    },
  },

  watch: {
    imageMapObjects() {
      this.debouncedImageMapObjects();
    },
    guideImageObjects() {
      this.debouncedGuideImageObjects();
    },
  },

  created() {
    this.debouncedImgResize = debounce(() => {
      this.updateSvgDimensions();
    }, 500);

    this.debouncedImageMapObjects = debounce(() => {
      this.$emit('image-map-objects', this.imageMapObjects);
    }, 200);

    this.debouncedGuideImageObjects = debounce(() => {
      this.$emit('guide-image-objects', this.guideImageObjects);
    }, 200);
  },

  methods: {
    updateSvgDimensions() {
      const { width, height } = this.$refs.img.$el.getBoundingClientRect();
      this.width = width;
      this.height = height;
    },

    onImgResize() {
      this.debouncedImgResize();
    },

    selectObject(idx: number) {
      this.selectedObjectIdx = idx;
    },

    addObject() {
      const nextId = this.objects.reduce((acc, { id }) => (acc < id ? id : acc), -1);
      this.coords.push([]);
      this.objects.push({ id: nextId + 1, description: '', weight: 0 });
    },

    removeObject(index: number) {
      this.coords.splice(index, 1);
      this.objects.splice(index, 1);
    },

    getClosestPointIndex(source: number[], targets: number[][]): number {
      if (!targets.length) return 0;

      const closest = targets.reduce((a, b) => (distance(source, a) < distance(source, b) ? a : b));

      return targets.findIndex((coords) => coords === closest);
    },

    addNode(event: any) {
      const { selectedObjectIdx } = this;
      if (selectedObjectIdx === null) return;

      const { width } = this;
      const { offsetX, offsetY } = event;

      const closest = this.getClosestPointIndex(
        [offsetX, offsetY],
        this.scaled[selectedObjectIdx].coords
      );
      this.coords[selectedObjectIdx].splice(closest + 1 ?? 0, 0, [
        offsetX / width,
        offsetY / width,
      ]);
    },

    updateNode(objIdx: number, nodeIdx: number, [x, y]: number[]) {
      const { width } = this;

      this.coords[objIdx].splice(nodeIdx, 1, [x / width, y / width]);
    },

    removeNode(nodeIdx: number) {
      const { selectedObjectIdx } = this;
      if (selectedObjectIdx === null) return;

      this.coords[selectedObjectIdx].splice(nodeIdx, 1);
    },

    dragNode(event: any, index: number) {
      const { selectedObjectIdx } = this;
      if (selectedObjectIdx === null) return;

      this.selectedNodeIdx = index;

      const { offsetX, offsetY } = event;
      this.updateNode(selectedObjectIdx, index, [offsetX, offsetY]);
      this.$refs.svg.addEventListener('mousemove', this.moveNode);
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
      this.$refs.svg.removeEventListener('mousemove', this.moveNode);
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
      r: 5;
    }
  }
}
</style>
