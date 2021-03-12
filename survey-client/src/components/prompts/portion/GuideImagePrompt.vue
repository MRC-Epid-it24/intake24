<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.guideImage.label') }} - {{ localDescription }}
      </template>
      <v-row>
        <v-col>
          <transition name="component-fade" mode="out-in">
            <v-card v-show="!selectedGuide">
              <!-- TODO: Implement image map or alternative -->
              <v-img class="align-end" :src="selectionImageUrl" :aspect-ratio="16 / 9">
                <template v-slot:placeholder>
                  <ImagePlaceholder></ImagePlaceholder>
                </template>
              </v-img>
              <!-- TODO: Value from image map/canvas -->
              <v-btn color="success" @click="onSelect()">{{ $t('common.continue') }}</v-btn>
            </v-card>
          </transition>
        </v-col>
      </v-row>
      <transition name="component-fade" mode="out-in">
        <!-- TODO: Doing the transition like this breaks the back feature. Move to expansion panels instead -->
        <v-row v-show="selectedGuide">
          <v-col>
            <v-card>
              <v-card-text>{{ $t('portion.guideImage.quantity') }}</v-card-text>
              <v-card-actions>
                <quantity-card :whole="true" :fraction="true"></quantity-card>
              </v-card-actions>
              <v-card-actions>
                <v-btn color="success">
                  {{ $t('portion.common.confirmButton') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </transition>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { GuideImagePromptProps, guideImagePromptDefaultProps } from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import QuantityCard from '@/components/elements/QuantityCard.vue';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'GuideImagePrompt',

  mixins: [BasePortion, localeContent],

  components: {
    QuantityCard,
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
      selectedGuide: false,
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

  methods: {
    onSelect() {
      this.selectedGuide = !this.selectedGuide;
      console.log(this.selectedGuide);
    },
    onSubmit() {
      this.$emit('Guide Image selection submitted');
    },
  },
});
</script>

<style lang="scss" scoped></style>
