<template>
  <v-container>
    <v-row>
      <v-img class="align-end" :src="getMainImage()" :aspect-ratio="16 / 9">
        <template v-slot:placeholder>
          <image-placeholder></image-placeholder>
        </template>
        <v-row>
          <v-col class="d-flex justify-end mr-auto">
            <v-chip class="ma-2">
              {{ mainWeight }}
            </v-chip>
          </v-col>
        </v-row>
      </v-img>
    </v-row>
    <v-row>
      <v-col class="pa-1" cols="3" sm="2" lg="1">
        <v-card @click="hadLessInput()">
          <v-img :src="getFirstThumbnail()">-</v-img>
          <v-overlay absolute>
            <v-btn icon>
              <v-icon>fas fa-fw fa-minus</v-icon>
            </v-btn>
          </v-overlay>
        </v-card>
      </v-col>
      <template v-for="(images, idx) in imageSet">
        <v-col v-bind:key="idx" class="pa-1" cols="3" sm="2" lg="1" :class="isSelected(idx)">
          <v-card @click="setSelection(idx)">
            <v-img :src="images.thumbnailUrl"></v-img>
          </v-card>
        </v-col>
      </template>
      <v-col class="pa-1 mr-auto" cols="3" sm="2" lg="1">
        <v-card @click="hadMoreInput()">
          <v-img :src="getLastThumbnail()">-</v-img>
          <v-overlay absolute>
            <v-btn icon>
              <v-icon>fas fa-fw fa-plus</v-icon>
            </v-btn>
          </v-overlay>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn @click="hadLessInput()">I had less</v-btn>
      </v-col>
      <v-col align="center">
        <v-btn @click="hadMoreInput()">I had more</v-btn>
      </v-col>
      <v-col align="center">
        <v-btn color="success" @click="servingCompleted()">I had this much</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import ImagePlaceholder from '@/components/elements/ImagePlaceholder.vue';
import { AsServedSetResponse } from '@common/types/http/foods';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'AsServedSelector',
  components: {
    ImagePlaceholder,
  },
  props: {
    imageSet: Array,
    asServedData: {
      type: Object as () => AsServedSetResponse,
    },
  },
  data() {
    return {
      selectedObjectIdx: null as number | null,
      completed: false as boolean,
    };
  },
  computed: {
    dataLoaded(): boolean {
      if (this.asServedData) {
        return true;
      }
      return false;
    },
    mainWeight(): string | null {
      if (!this.dataLoaded) return null;

      if (this.selectedObjectIdx === null) return null;

      return `${this.asServedData.images[this.selectedObjectIdx].weight}g`;
    },
  },
  mounted() {
    this.setDefaultSelection();
  },

  methods: {
    getMainImage(): string {
      if (this.selectedObjectIdx === null) {
        return '';
      }
      return this.dataLoaded ? this.asServedData.images[this.selectedObjectIdx].mainImageUrl : '';
    },
    setDefaultSelection() {
      // Variable length image sets: set default selected to middle value
      this.selectedObjectIdx = Math.floor(this.asServedData.images.length / 2);
    },
    setSelection(idx: number) {
      this.selectedObjectIdx = idx;
    },
    isSelected(idx: number): string {
      return idx === this.selectedObjectIdx ? 'selectedThumb rounded-lg' : '';
    },
    hadMoreInput() {
      if (this.selectedObjectIdx === null) {
        return;
      }

      const maxLength = this.asServedData.images.length - 1;
      if (this.selectedObjectIdx + 1 > maxLength) {
        console.log('Trigger input quantity prompt');
        // User wants to input more than thumbnail quantity on screen
        // TO DO Method for this
      } else {
        this.selectedObjectIdx =
          this.selectedObjectIdx + 1 === maxLength ? maxLength : this.selectedObjectIdx + 1;
      }
    },
    hadLessInput() {
      if (this.selectedObjectIdx === null) {
        return;
      }
      if (this.selectedObjectIdx - 1 < 0) {
        console.log('Trigger input quantity prompt');
        // User wants to input less than thumbnail quantities on screen
        // TO DO Method for this
      } else {
        this.selectedObjectIdx = this.selectedObjectIdx - 1 === 0 ? 0 : this.selectedObjectIdx - 1;
      }
    },
    getFirstThumbnail(): string {
      if (this.selectedObjectIdx === null) {
        return '';
      }
      // This check is slightly redundant
      return this.dataLoaded ? this.asServedData.images[0].thumbnailUrl : '';
    },
    getLastThumbnail(): string {
      if (this.selectedObjectIdx === null) {
        return '';
      }
      // This check is slightly redundant
      return this.dataLoaded
        ? this.asServedData.images[this.asServedData.images.length - 1].thumbnailUrl
        : '';
    },
    servingCompleted() {
      this.$emit('as-served-selector-submit', this.completed);
    },
  },
});
</script>

<style lang="scss" scoped>
.selectedThumb {
  border: 0.1em solid #2196f3;
}
</style>
