<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ localeDescription }}
      </template>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            {{ $t('portion.drinkScale.label', { food: localeDescription }) }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>Image map here</v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            {{ $t('portion.drinkScale.sliderLabel', { food: localeDescription }) }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col>
                <v-img class="align-end" :src="selectionImageUrl" :aspect-ratio="16 / 9">
                  <template v-slot:placeholder>
                    <image-placeholder></image-placeholder>
                  </template>
                  <v-row class="drink-slider">
                    <v-spacer></v-spacer>
                    <v-col xs="2" sm="1" class="d-flex justify-end mr-auto">
                      <v-slider
                        v-model="sliderValue"
                        :hint="$t('portion.drinkScale.lessFullButton')"
                        max="100"
                        min="0"
                        vertical
                        thumb-label
                        ticks
                        class="ma-0"
                      ></v-slider>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-end mr-auto">
                      <v-chip class="ma-2">
                        {{ drinkMilliliters }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn>{{ $t('portion.drinkScale.lessFullButton') }}</v-btn>
              </v-col>
              <v-col>
                <v-btn>{{ $t('portion.drinkScale.moreFullButton') }}</v-btn>
              </v-col>
              <v-col>
                <v-btn color="success">{{ $t('portion.drinkScale.confirmFullButton') }}</v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-row>
        <v-col>
          <v-card></v-card>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { DrinkScalePromptProps, drinkScalePromptDefaultProps } from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'DrinkScalePrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => DrinkScalePromptProps,
    },
  },

  data() {
    return {
      ...merge(drinkScalePromptDefaultProps, this.props),
      errors: [] as string[],
      selectedGuide: false, // TODO: Model this correctly
      selectedQuantity: false,
      panelOpen: 0,
      sliderValue: 75,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
    drinkMilliliters(): string {
      return `${this.sliderValue}ml`;
    },
  },

  methods: {
    selectImage() {
      this.selectedGuide = true;
    },
    onSubmit() {
      this.$emit('DrinkScale completed');
    },
  },
});
</script>

<style lang="scss" scoped>
.drink-slider {
  height: 100%;
}
</style>
