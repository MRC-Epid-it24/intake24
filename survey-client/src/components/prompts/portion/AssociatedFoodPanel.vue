<template>
  <v-row>
    <v-col>
      <v-expansion-panels v-model="panelOpenId">
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            Select associated food
            <template v-slot:actions>
              <valid-invalid-icon></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            Content
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            Option select portion method
            <template v-slot:actions>
              <valid-invalid-icon></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            Content
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            Select portion size
            <template v-slot:actions>
              <valid-invalid-icon></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            Content
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { AssociatedFoodsPanelProps, associatedFoodPanelDefaultProps } from '@common/prompts';
import BaseExpansionPortion, { ExpansionPortion } from './BaseExpansionPortion';

export default (Vue as VueConstructor<Vue & ExpansionPortion>).extend({
  name: 'AssociatedFoodPanel',

  mixins: [BaseExpansionPortion],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => AssociatedFoodsPanelProps,
    },
  },

  data() {
    return {
      ...merge(associatedFoodPanelDefaultProps, this.promptProps),
      errors: [] as string[],
      // expansionPanelTotal: 2 as number,
      validPanels: [] as any,
      // Below are rough/testing vars to control UI prototype
      bowlType: 'A' as string, // For testing until food linking
      foodSelected: false as boolean,
      foodValue: '' as string,
      foodCode: 'SMLK' as string,
      foodData: [] as any,
      portionMethodSelected: false as boolean,
      portionMethodValue: '' as string,
      portionSelected: false as boolean,
      portionValue: '' as string,
      imageMapId: 'milkbowlA',
      imageMapData: [] as any,
      imageMapLoaded: false as boolean,
      // If MCRL (milk_in_cereal) associated food category is triggered, we will wind up here
      // Associated_foods contains `text` field which is the question
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

  mounted() {
    // this.validPanels = new Array<boolean>(this.expansionPanelTotal);
  },

  methods: {
    // TODO: fix this as no milk will be false and not validate
    // displayQuestionStyle(button: string) {
    //   if (button === 'yes' && this.displayQuestions) {
    //     return 'success';
    //   }
    //   return '';
    // },
    // async fetchFoodData() {
    //   const locale = 'en_GB';
    //   try {
    //     const { data } = await this.$http.get(`foods/image-maps/${locale}/${this.foodCode}`);
    //     this.foodData = { ...data };
    //     // this.imageMapLoaded = true;
    //   } catch (e) {
    //     console.log(e);
    //   }
    // },
    // async fetchImageMapData() {
    //   try {
    //     const { data } = await this.$http.get(`portion-sizes/image-maps/${this.imageMapId}`);
    //     this.imageMapData = { ...data };
    //     this.imageMapLoaded = true;
    //   } catch (e) {
    //     console.log(e);
    //   }
    // },
    // setDisplayQuestions(value: boolean) {
    //   this.displayQuestions = value;
    // },
    // selectFood(value: string) {
    //   this.foodValue = value;
    //   this.foodSelected = true;
    //   this.setPanelOpen(1);
    // },
    // selectPortionMethod(value: string) {
    //   this.portionMethodSelected = true;
    //   this.portionMethodValue = value;
    //   this.setPanelOpen(2);
    //   if (!this.imageMapLoaded) {
    //     this.fetchImageMapData();
    //   }
    // },
    // selectPortion() {
    //   this.portionSelected = true;
    //   this.setPanelOpen(-1);
    // },
    // submitButtonStyle() {
    //   if (this.foodSelected && this.portionMethodSelected && this.portionSelected) {
    //     return 'success';
    //   }
    //   return 'disabled';
    // },
    // submit() {
    //   if (this.foodSelected && this.portionMethodSelected && this.portionSelected) {
    //     console.log('submitted');
    //   } else {
    //     console.log('not complete');
    //   }
    // },
  },
});
</script>

<style lang="scss" scoped></style>
