<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ localeDescription }}
      </template>
      <v-expansion-panels v-model="panelOpen">
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            {{ $t('portion.drinkScale.label', { food: localeDescription }) }}
            <template v-slot:actions>
              <v-icon color="success" v-if="selectedGuide">fas fa-fw fa-check</v-icon>
              <v-icon color="error" v-if="!selectedGuide">fas fa-fw fa-exclamation</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col>
                <v-img class="align-end" :src="selectionImageUrl" :aspect-ratio="16 / 9"></v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn color="success" @click="onSelectGuide()">
                  {{ $t('common.continue') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            {{ $t('portion.drinkScale.sliderLabel', { food: localeDescription }) }}
            <template v-slot:actions>
              <v-icon color="success" v-if="selectedQuantity">fas fa-fw fa-check</v-icon>
              <v-icon color="error" v-if="!selectedQuantity">fas fa-fw fa-exclamation</v-icon>
            </template>
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
                      <!-- TODO: Height of this -->
                      <v-slider
                        v-model="sliderValue"
                        :hint="$t('portion.drinkScale.lessFullButton')"
                        max="100"
                        min="0"
                        vertical
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
            <v-row v-if="hasErrors">
              <v-col>
                <v-alert color="error" class="ma-0">
                  <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
                </v-alert>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn @click="modifySliderValue(-10)">
                  {{ $t('portion.drinkScale.lessFullButton') }}
                </v-btn>
              </v-col>
              <v-col>
                <v-btn @click="modifySliderValue(10)">
                  {{ $t('portion.drinkScale.moreFullButton') }}
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="success" @click="submit()">
                  {{ $t('portion.drinkScale.confirmFullButton') }}
                </v-btn>
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
import { merge } from '@intake24/common/util';
import { DrinkScalePromptProps, drinkScalePromptDefaultProps } from '@intake24/common/prompts';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'DrinkScalePrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => DrinkScalePromptProps,
    },
  },

  data() {
    return {
      ...merge(drinkScalePromptDefaultProps, this.promptProps),
      errors: [] as string[],
      selectedGuide: false, // TODO: Model this correctly
      selectedQuantity: false,
      selectionImageUrl: 'https://api.intake24.org/images/glasses/glass3.jpg',
      panelOpen: 0, // ID which panel is open
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
    modifySliderValue(value: number) {
      // Handle upper and lower bounds, otherwise assign.
      if (this.sliderValue + value > 100) {
        this.sliderValue = 100;
      } else if (this.sliderValue + value < 0) {
        this.sliderValue = 0;
      } else {
        this.sliderValue += value;
      }
    },
    onSelectGuide() {
      this.selectedGuide = !this.selectedGuide;
      this.panelOpen = 1;
    },
    clearErrors() {
      this.errors = [];
    },
    isValid() {
      if (this.selectedGuide) {
        return true;
      }
      return false;
    },
    submit() {
      if (!this.isValid()) {
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            this.$t('portion.guideImage.validation.required').toString(),
        ];
        return;
      }
      this.$emit('DrinkScale completed');
      this.selectedQuantity = true; // This sets the icon on the panel, UI sugar
      this.panelOpen = -1; // Close panels if no errors
    },
  },
});
</script>

<style lang="scss" scoped>
.drink-slider {
  height: 100%;
}
</style>
