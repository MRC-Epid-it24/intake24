<template>
  <v-container>
    <v-row>
      <v-col>
        <v-message>Go back to the previous step</v-message>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col cols="11">
              <v-card-text>
                Using these pictures, please choose how much <strong>{{ localDescription }}</strong> you had.
              </v-card-text>
            </v-col>
            <v-col cols="1">
              <v-btn color="primary" justify="end">{{ $t('common.help') }}</v-btn>
            </v-col>
          </v-row>
          
        </v-card>
      </v-col>
    </v-row>
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
                      <!-- <v-card-text>{{number}}</v-card-text> -->
                    </v-card>
                  </v-col>
                </template>
                <v-col class="pa-1" align="center">
                  <v-card>
                    <v-img :src="selectionImageUrl" max-width="5rem">
                    </v-img>
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
              </v-row>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
  </v-container>
  
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { AsServedPromptProps } from '@common/types';
import { asServedPromptDefaultProps } from '@common/defaults';
import localeContent, { LocaleContent } from '@/components/mixins/localeContent';
import ImagePlaceholder from '@/components/elements/ImagePlaceholder.vue';
import BasePrompt, { Prompt } from '../BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'AsServedPrompt',

  components: { 
    ImagePlaceholder 
  },

  mixins: [BasePrompt, localeContent],

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