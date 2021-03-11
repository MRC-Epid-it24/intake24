<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.guideImage.label') }} - {{ localDescription }}
      </template>
      <v-row>
        <v-col>
          <v-card>
            <!-- TODO: Implement image map or alternative -->
            <v-img class="align-end" :src="selectionImageUrl" :aspect-ratio="16 / 9">
              <template v-slot:placeholder>
                <ImagePlaceholder></ImagePlaceholder>
              </template>
            </v-img>
            <continue></continue>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-text>{{ $t('portion.guideImage.quantity') }}</v-card-text>
            <v-card-actions>
              <incrementer :whole="true" :fraction="true"></incrementer>
            </v-card-actions>
            <v-card-actions>
              <v-btn primary>
                {{ $t('portion.common.confirmButton') }} 
              </v-btn>
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
import { GuideImagePromptProps, guideImagePromptDefaultProps } from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import Incrementer from '@/components/elements/Incrementer.vue';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'GuideImagePrompt',

  mixins: [BasePortion, localeContent],

  components: {
    Incrementer,
  },

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => GuideImagePromptProps,
    },
  },

  data() {
    return {
      ...merge(guideImagePromptDefaultProps, this.props),
      errors: [] as string[],
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },
});
</script>

<style lang="scss" scoped></style>
