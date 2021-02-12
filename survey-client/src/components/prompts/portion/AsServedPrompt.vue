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
          <v-img class="align-end" :src="imageUrl" :aspect-ratio="16 / 9">
            <template v-slot:placeholder>
              <ImagePlaceholder></ImagePlaceholder>
            </template>
          </v-img>
          <v-card-text>Text here</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>Pictures of portions here</v-col>
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