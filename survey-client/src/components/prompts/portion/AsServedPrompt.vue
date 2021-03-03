<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.asServed.label') }} - {{ localDescription }}
      </template>
      <v-row>
        <v-col>
          <v-card>
            <v-img class="align-end" :src="selectionImageUrl" :aspect-ratio="16 / 9">
              <template v-slot:placeholder>
                <ImagePlaceholder></ImagePlaceholder>
              </template>
              <v-message class="align-right">100g</v-message>
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

    <!-- <v-row>
      <v-col>
        <h2>{{ localeDescription }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-message>Go back to the previous step</v-message>
      </v-col>
    </v-row> -->

    

  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { AsServedPromptProps } from '@common/types';
import { asServedPromptDefaultProps } from '@common/defaults';
import localeContent from '@/components/mixins/localeContent';
import ImagePlaceholder from '@/components/elements/ImagePlaceholder.vue';
import BasePortion, { Portion } from './BasePortion';


export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'AsServedPrompt',

  components: {
    ImagePlaceholder,
  },

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => AsServedPromptProps,
    },
  },

  data() {
    return {
      ...merge(asServedPromptDefaultProps, this.props),
      errors: [] as string[],
    };
  },
});
</script>

<style lang="scss" scoped></style>
