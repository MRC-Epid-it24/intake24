<template>
  <v-container>
    <v-row>
      <v-img :aspect-ratio="16 / 9" class="align-end" :src="image">
        <template #placeholder>
          <image-placeholder></image-placeholder>
        </template>
        <v-row>
          <v-col class="d-flex justify-end mr-auto">
            <v-chip class="ma-2 font-weight-medium" color="black" outlined>
              {{ weight }}
            </v-chip>
          </v-col>
        </v-row>
        <v-overlay absolute :value="overlay"> Input: Enter how much more/less you had </v-overlay>
      </v-img>
    </v-row>
    <v-row>
      <v-col class="pa-1" cols="3" lg="1" sm="2">
        <v-card @click="hadLess">
          <v-img :src="firstThumbnail"></v-img>
          <v-overlay absolute>
            <v-btn icon>
              <v-icon>fas fa-fw fa-minus</v-icon>
            </v-btn>
          </v-overlay>
        </v-card>
      </v-col>
      <template v-for="(images, idx) in asServedData.images">
        <v-col :key="idx" class="pa-1" :class="isSelected(idx)" cols="3" lg="1" sm="2">
          <v-card @click="setSelection(idx)">
            <v-img :src="images.thumbnailUrl"></v-img>
          </v-card>
        </v-col>
      </template>
      <v-col class="pa-1 mr-auto" cols="3" lg="1" sm="2">
        <v-card @click="hadMore">
          <v-img :src="lastThumbnail"></v-img>
          <v-overlay absolute>
            <v-btn icon>
              <v-icon>fas fa-fw fa-plus</v-icon>
            </v-btn>
          </v-overlay>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block @click="hadLess">
          {{ $t(`portion.as-served.${type}.less`) }}
        </v-btn>
      </v-col>
      <v-col>
        <v-btn block @click="hadMore">
          {{ $t(`portion.as-served.${type}.more`) }}
        </v-btn>
      </v-col>
      <v-col align="center" md="4" xs="12">
        <v-btn block color="success" @click="confirm">
          {{ $t(`portion.as-served.${type}.confirm`) }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { SelectedAsServedImage } from '@intake24/common/types';
import type { AsServedSetResponse } from '@intake24/common/types/http/foods';
import { ImagePlaceholder } from '@intake24/survey/components/elements';

export default defineComponent({
  name: 'AsServedSelector',

  components: { ImagePlaceholder },

  props: {
    asServedSetId: {
      type: String,
      required: true,
    },
    initialState: {
      type: Number,
    },
    type: {
      type: String as PropType<'serving' | 'leftover'>,
      default: 'serving',
    },
  },

  data() {
    return {
      objectIdx: this.initialState,
      asServedData: {} as AsServedSetResponse,
      dataLoaded: false,
      // Prototyping
      overlay: false,
    };
  },

  computed: {
    image(): string {
      if (this.objectIdx === undefined) return '';

      return this.dataLoaded ? this.asServedData.images[this.objectIdx].mainImageUrl : '';
    },
    weight(): string | null {
      if (!this.dataLoaded) return null;

      if (this.objectIdx === undefined) return null;

      return `${this.asServedData.images[this.objectIdx].weight}g`;
    },
    firstThumbnail(): string {
      if (this.objectIdx === null) return '';

      // This check is slightly redundant
      return this.dataLoaded ? this.asServedData.images[0].thumbnailUrl : '';
    },
    lastThumbnail(): string {
      if (this.objectIdx === null) return '';

      // This check is slightly redundant
      return this.dataLoaded
        ? this.asServedData.images[this.asServedData.images.length - 1].thumbnailUrl
        : '';
    },
  },

  watch: {
    async asServedSetId() {
      await this.fetchAsServedImageData();
    },
  },

  async mounted() {
    await this.fetchAsServedImageData();
  },

  methods: {
    async fetchAsServedImageData() {
      try {
        const { data } = await this.$http.get<AsServedSetResponse>(
          `portion-sizes/as-served-sets/${this.asServedSetId}`
        );
        this.asServedData = { ...data };
        this.setDataLoaded();
        this.setDefaultSelection();
      } catch (e) {
        //FIXME: proper error handling
        console.log(e);
      }
    },

    setDataLoaded() {
      this.dataLoaded = true;
    },

    setDefaultSelection() {
      if (this.objectIdx === undefined) {
        // Variable length image sets: set default selected to middle value
        this.setSelection(Math.floor(this.asServedData.images.length / 2));
      }
    },

    setSelection(idx: number) {
      this.objectIdx = idx;
      this.update();
    },

    isSelected(idx: number): string {
      return idx === this.objectIdx ? 'selectedThumb rounded-lg' : '';
    },

    hadMore() {
      if (this.objectIdx === undefined) return;

      const maxLength = this.asServedData.images.length - 1;
      if (this.objectIdx + 1 > maxLength) {
        console.log('Trigger input quantity prompt');
        // User wants to input more than thumbnail quantity on screen
        // TO DO Method for this
        this.overlay = true;
      } else {
        this.objectIdx = this.objectIdx + 1 === maxLength ? maxLength : this.objectIdx + 1;
      }
      this.update();
    },

    hadLess() {
      if (this.objectIdx === undefined) return;

      if (this.objectIdx - 1 < 0) {
        console.log('Trigger input quantity prompt');
        // User wants to input less than thumbnail quantities on screen
        // TO DO Method for this
        this.overlay = true;
      } else {
        this.objectIdx = this.objectIdx - 1 === 0 ? 0 : this.objectIdx - 1;
      }
      this.update();
    },

    update() {
      const newState: SelectedAsServedImage | null =
        this.objectIdx === undefined
          ? null
          : {
              asServedSetId: this.asServedSetId,
              index: this.objectIdx,
              weight: this.asServedData.images[this.objectIdx].weight,
              imageUrl: this.asServedData.images[this.objectIdx].mainImageUrl,
            };

      this.$emit('update', newState);
    },

    confirm() {
      if (this.objectIdx === undefined) return;

      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss" scoped>
.selectedThumb {
  border: 2px solid #2196f3;
}
</style>
