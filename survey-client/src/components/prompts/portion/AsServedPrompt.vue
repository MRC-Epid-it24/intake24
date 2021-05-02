<template>
  <v-container>
    <portion-layout :text="promptProps.text" :description="promptProps.description">
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
                    {{ mainWeight }}
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
                      <v-overlay absolute>
                        <v-btn icon>
                          <v-icon>fas fa-fw fa-minus</v-icon>
                        </v-btn>
                      </v-overlay>
                    </v-card>
                  </v-col>
                  <template v-for="(imageSet, idx) in selectionImageData.images">
                    <v-col v-bind:key="idx" class="pa-1" :class="isSelected(idx)">
                      <v-card @click="setSelection(idx)">
                        <v-img :src="imageSet.thumbnailUrl" max-width="5rem"></v-img>
                      </v-card>
                    </v-col>
                  </template>
                  <v-col class="pa-1">
                    <v-card @click="hadMoreInput()">
                      <v-img :src="getLastThumbnail()" max-width="5rem">-</v-img>
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

import localeContent from '@/components/mixins/localeContent';
import ImagePlaceholder from '@/components/elements/ImagePlaceholder.vue';
import { AsServedSetResponse } from '@common/types/http/foods';
import { basePromptProps, BasePromptProps } from '@common/prompts';
import { LocaleTranslation } from '@common/types';
import { AsServedSet } from '@common/types/models';
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
      type: Object as () => BasePromptProps,
      required: true,
    },
    foodName: {
      type: Object as () => LocaleTranslation,
      required: true,
    },
    asServedSetId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      ...merge(basePromptProps, this.promptProps),
      errors: [] as string[],
      selectionImageData: {} as AsServedSetResponse,
      selectedObjectIdx: null as number | null,
      dataLoaded: false,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.foodName);
    },
    mainWeight(): string | null {
      if (!this.dataLoaded) return null;

      if (this.selectedObjectIdx === null) return null;

      return `${this.selectionImageData.images[this.selectedObjectIdx].weight}g`;
    },
  },

  mounted() {
    this.fetchSelectionImageData();
  },

  methods: {
    async fetchSelectionImageData() {
      try {
        const { data } = await this.$http.get<AsServedSetResponse>(
          `portion-sizes/as-served-sets/${this.asServedSetId}`
        );
        this.selectionImageData = { ...data };
        this.setDefaultSelection();
        this.setDataLoaded();
      } catch (e) {
        console.log(e);
      }
    },
    setDefaultSelection() {
      // Variable length image sets: set default selected to middle value
      this.selectedObjectIdx = Math.floor(this.selectionImageData.images.length / 2);
    },
    setDataLoaded() {
      this.dataLoaded = true;
    },
    setSelection(idx: number) {
      this.selectedObjectIdx = idx;
    },
    getMainImage(): string {
      if (this.selectedObjectIdx === null) {
        return '';
      }
      return this.dataLoaded
        ? this.selectionImageData.images[this.selectedObjectIdx].mainImageUrl
        : '';
    },
    getFirstThumbnail(): string {
      if (this.selectedObjectIdx === null) {
        return '';
      }
      return this.dataLoaded ? this.selectionImageData.images[0].thumbnailUrl : '';
    },
    getLastThumbnail() {
      if (this.selectedObjectIdx === null) {
        return '';
      }
      return this.dataLoaded
        ? this.selectionImageData.images[this.selectionImageData.images.length - 1].thumbnailUrl
        : '';
    },
    isSelected(idx: number): string {
      return idx === this.selectedObjectIdx ? 'selectedThumb rounded-lg' : '';
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

        console.log('had less');
      }
    },
    hadMoreInput() {
      if (this.selectedObjectIdx === null) {
        return;
      }

      const maxLength = this.selectionImageData.images.length - 1;
      if (this.selectedObjectIdx + 1 > maxLength) {
        console.log('Trigger input quantity prompt');
        // User wants to input more than thumbnail quantity on screen
        // TO DO Method for this
      } else {
        this.selectedObjectIdx =
          this.selectedObjectIdx + 1 === maxLength ? maxLength : this.selectedObjectIdx + 1;

        console.log('had more');
      }
    },
    submit() {
      this.$emit('as-served-selected', {
        imageIndex: this.selectedObjectIdx,
        weight: this.selectionImageData.images[this.selectedObjectIdx].weight,
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
