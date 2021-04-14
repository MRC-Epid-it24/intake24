<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.asServed.label', { food: localeDescription }) }}
      </template>

      <v-row>
        <v-col>
          <div v-for="(image, idx) in selectionImages" :key="idx">
            <v-img :src="image.thumbnailUrl" alt=""></v-img>
            {{ image.thumbnailUrl }}
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card>
            <v-img class="align-end" :src="selectionImageUrl" :aspect-ratio="16 / 9">
              <template v-slot:placeholder>
                <ImagePlaceholder></ImagePlaceholder>
              </template>
              <v-row>
                <v-col class="d-flex justify-end mr-auto">
                  <v-chip class="ma-2">
                    {{ foodWeight }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-img>
            <v-card-actions>
              <v-container dense>
                <v-row>
                  <v-col class="pa-1">
                    <v-card>
                      <v-img :src="selectionImageUrl" max-width="5rem">-</v-img>
                      <v-overlay absolute>
                        <v-btn icon>
                          <v-icon>fas fa-fw fa-minus</v-icon>
                        </v-btn>
                      </v-overlay>
                    </v-card>
                  </v-col>
                  <template v-for="index in 7">
                    <v-col v-bind:key="index" class="pa-1">
                      <v-card>
                        <v-img :src="selectionImageUrl" max-width="5rem"></v-img>
                      </v-card>
                    </v-col>
                  </template>
                  <v-col class="pa-1" align="center">
                    <v-card>
                      <v-img :src="selectionImageUrl" max-width="5rem"></v-img>
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
                    <v-btn>I had less</v-btn>
                  </v-col>
                  <v-col align="center">
                    <v-btn>I had more</v-btn>
                  </v-col>
                  <v-col align="center">
                    <v-btn color="success">I had this much</v-btn>
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
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
    dataLoaded(): boolean {
      return !!Object.keys(this.selectionImageData).length;
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
      const { data } = await this.$http.get<AsServedSetResponse>(
        `portion-sizes/as-served-sets/lasagne`
      );

      this.selectionImageData = { ...data };
    },

    submit() {
      this.$emit('AsServed selected');
    },
  },
});
</script>

<style lang="scss" scoped></style>
