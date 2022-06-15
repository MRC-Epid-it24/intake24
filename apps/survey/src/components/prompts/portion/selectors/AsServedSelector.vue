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
        <v-overlay absolute :value="overlay"> Input: Enter how much more/less you had </v-overlay>
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
      <template v-for="(images, idx) in asServedData.images">
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
        <v-btn @click="hadLessInput()">
          {{ $t('portion.common.lessButton') }}
        </v-btn>
      </v-col>
      <v-col align="center">
        <v-btn @click="hadMoreInput()">
          {{ $t('portion.common.moreButton') }}
        </v-btn>
      </v-col>
      <v-col align="center" xs="12" md="4" class="ma-2">
        <v-btn color="success" @click="servingCompleted()" block>
          {{ $t('portion.common.confirmButton') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import type { AsServedSetResponse } from '@intake24/common/types/http/foods';
import ImagePlaceholder from '@intake24/survey/components/elements/ImagePlaceholder.vue';

export default defineComponent({
  name: 'AsServedSelector',

  components: {
    ImagePlaceholder,
  },

  props: {
    asServedSetId: {
      type: String,
    },
  },

  data() {
    return {
      selectedObjectIdx: null as number | null,
      asServedData: {} as AsServedSetResponse,
      dataLoaded: false as boolean,
      // Prototyping
      overlay: false as boolean,
    };
  },

  computed: {
    mainWeight(): string | null {
      if (!this.dataLoaded) return null;

      if (this.selectedObjectIdx === null) return null;

      return `${this.asServedData.images[this.selectedObjectIdx].weight}g`;
    },
  },

  mounted() {
    this.fetchAsServedImageData();
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
        console.log(e);
      }
    },
    getMainImage(): string {
      if (this.selectedObjectIdx === null) {
        return '';
      }
      return this.dataLoaded ? this.asServedData.images[this.selectedObjectIdx].mainImageUrl : '';
    },
    setDataLoaded() {
      this.dataLoaded = true;
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
        this.overlay = true;
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
        this.overlay = true;
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
      if (this.selectedObjectIdx === null) return;
      this.$emit('as-served-selector-submit', {
        imageIndex: this.selectedObjectIdx,
        weight: this.asServedData.images[this.selectedObjectIdx].weight,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.selectedThumb {
  border: 0.1em solid #2196f3;
}
</style>
