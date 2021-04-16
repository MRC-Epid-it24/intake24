<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.asServed.label', { food: localeDescription }) }}
      </template>
      <v-row>
        <v-col>
          <v-card>
            <v-img class="align-end" :src="getMainImage()" :aspect-ratio="16 / 9">
              <template v-slot:placeholder>
                <ImagePlaceholder></ImagePlaceholder>
              </template>
              <v-row>
                <v-col class="d-flex justify-end mr-auto">
                  <v-chip class="ma-2">
                    {{ selectionImages[selectedObjectIdx].weight }}g
                    <!-- Are these always in grams? -->
                  </v-chip>
                </v-col>
              </v-row>
            </v-img>
            <v-card-actions>
              <v-container dense>
                <v-row>
                  <v-col class="pa-1">
                    <v-card @click="hadLessInput()">
                      <v-img :src="getFirstThumbnail()" max-width="5rem">-</v-img>
                      <v-overlay absolute >
                        <v-btn icon>
                          <v-icon>fas fa-fw fa-minus</v-icon>
                        </v-btn>
                      </v-overlay>
                    </v-card>
                  </v-col>
                  <template v-for="(imageSet, idx) in selectionImages">
                    <v-col v-bind:key="idx" class="pa-1" :class="isSelected(idx)">
                      <v-card @click="setSelection(idx)">
                        <v-img :src="imageSet.thumbnailUrl" max-width="5rem"></v-img>
                      </v-card>
                    </v-col>
                  </template>
                  <v-col class="pa-1">
                    <v-card @click="hadMoreInput()">
                      <v-img :src="getLastThumbnail()" max-width="5rem">-</v-img>
                      <v-overlay absolute >
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
                    <v-btn color="success" @click="submit()">I had this much</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { AsServedPromptProps, asServedPromptDefaultProps } from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import ImagePlaceholder from '@/components/elements/ImagePlaceholder.vue';
import { AsServedSetResponse, AsServedImageResponse } from '@common/types/http/foods';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'AsServedPrompt',

  components: {
    ImagePlaceholder,
  },

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => AsServedPromptProps,
    },
  },

  data() {
    return {
      ...merge(asServedPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      foodWeight: '100g', // This will be part of the props
      selectionImageData: {} as AsServedSetResponse,
      selectedObjectIdx: null as number | null,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
    dataLoaded(): boolean {
      return !!Object.keys(this.selectionImageData).length;
    },
    thumbnailImages(): string[] {
      // Not sure if this is needed now
      if (!this.dataLoaded) return [];

      return this.selectionImageData.images.map((urlSet) => {
        return urlSet.thumbnailUrl;
      });
    },
    selectionImages(): AsServedImageResponse[] | [] {
      if (!this.dataLoaded) return [];

      return this.selectionImageData.images;
    },
  },

  mounted() {
    this.fetchSelectionImageData();
  },

  methods: {
    async fetchSelectionImageData() {
      // const { data } = await this.$http.get<AsServedSetResponse>(
      //   `portion-sizes/as-served-sets/lasagnesdasd`
      // ).then(res => {
      //   this.selectionImageData = { ...data };
      //   this.setDefaultSelection();
      // });

      // At present this errors if there's a 404, error is unhandled
      const { data } = await this.$http.get<AsServedSetResponse>(
        `portion-sizes/as-served-sets/lasagnesdasd`
      );

      this.selectionImageData = { ...data };
      this.setDefaultSelection();
    },
    setDefaultSelection() {
      // Variable length image sets: set default selected to middle value
      this.selectedObjectIdx = Math.floor(this.selectionImageData.images.length / 2);
    },
    setSelection(idx: number) {
      this.selectedObjectIdx = idx;
    },
    getMainImage(): string {
      // This is redundant - need to think how to handle null better
      if (this.selectedObjectIdx === null || this.selectedObjectIdx === undefined) {
        return '';
      }
      return this.dataLoaded ? this.selectionImages[this.selectedObjectIdx].mainImageUrl : '';
    },
    getFirstThumbnail(): string {
      return this.dataLoaded ? this.selectionImages[0].thumbnailUrl : '';
      // return this.selectionImages[0].thumbnailUrl;
    },
    getLastThumbnail() {
      return this.dataLoaded
        ? this.selectionImages[this.selectionImages.length - 1].thumbnailUrl
        : '';
    },
    isSelected(idx: number): string {
      // if (idx === this.selectedObjectIdx) {
      //   return true;
      // }
      // return false;
      return idx === this.selectedObjectIdx ? 'selectedThumb rounded-lg' : '';
    },
    hadLessInput() {
      if (this.selectedObjectIdx === null || this.selectedObjectIdx === undefined) {
        return;
      }

      if (this.selectedObjectIdx - 1 < 0) {
        console.log('Trigger input quantity prompt');
        // User wants to input less than on screen
        // TO DO Method for this
      } else {
        this.selectedObjectIdx = this.selectedObjectIdx - 1 === 0 ? 0 : this.selectedObjectIdx - 1;

        console.log('had less');
      }
    },
    hadMoreInput() {
      // This is tripping up as it's falsy
      if (this.selectedObjectIdx === null || this.selectedObjectIdx === undefined) {
        return;
      }

      const maxLength = this.selectionImages.length - 1;
      if (this.selectedObjectIdx + 1 > maxLength) {
        console.log('Trigger input quantity prompt');
        // User wants to input more than on screen
        // TO DO Method for this
      } else {
        this.selectedObjectIdx =
          this.selectedObjectIdx + 1 === maxLength ? maxLength : this.selectedObjectIdx + 1;

        console.log('had more');
      }
    },
    submit() {
      this.$emit('AsServed selected');
    },
  },
});
</script>

<style lang="scss" scoped>
  .selectedThumb {
    border: 0.1em solid #2196F3;
  }
</style>
