<template>
  <v-row>
    <v-col>
      <v-expansion-panels v-model="panelOpenId">
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            Please select the {associated food} you had:
            <template v-slot:actions>
              <valid-invalid-icon></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <h4>Foods in this category:</h4>
            <v-list>
              <v-list-item @click="selectFood('almond milk')">Placeholder items</v-list-item>
              <v-list-item @click="selectFood('almond milk')">Almond milk</v-list-item>
              <v-list-item @click="selectFood('hot milk')">Hot milk, semi-skimmed</v-list-item>
              <v-list-item @click="selectFood('hot milk')">Hot milk, whole</v-list-item>
              <v-list-item @click="selectFood('milk')">Milk, semi-skimmed</v-list-item>
              <v-list-item @click="selectFood('milk')">Milk, skimmed</v-list-item>
            </v-list>
            <v-btn>{{ $t('portion.milkCereal.foodSelectButton') }}</v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            Option select portion method (if applicable)
            <template v-slot:actions>
              <valid-invalid-icon></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col class="col-6">
                <v-card @click="selectPortionMethod('glasses')">
                  <v-img
                    src="https://it24-dev.mrc-epid.cam.ac.uk/images/portion/gsoftdrnk.jpg"
                  ></v-img>
                  <v-card-title>In glasses (placeholders)</v-card-title>
                  <v-card-actions></v-card-actions>
                </v-card>
              </v-col>
              <v-col class="col-6">
                <v-card @click="selectPortionMethod('bowls')">
                  <v-img
                    src="https://it24-dev.mrc-epid.cam.ac.uk/images/cereal/milkbowlA.jpg"
                  ></v-img>
                  <v-card-title>In bowls</v-card-title>
                  <v-card-actions></v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            Select how much {associated food} you had:
            <template v-slot:actions>
              <valid-invalid-icon></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p>Please choose the level your milk came up to (without cereal).</p>
            <!-- Portion estimation - this will display the asServed gallery for the selected milk, using the bowl reference it was passed -->
            <v-img :src="imageMapData.baseImageUrl" @click="selectPortion()"></v-img>
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
    async fetchFoodData() {
      const locale = 'en_GB';
      try {
        const { data } = await this.$http.get(`foods/image-maps/${locale}/${this.foodCode}`);
        this.foodData = { ...data };
        // this.imageMapLoaded = true;
      } catch (e) {
        console.log(e);
      }
    },
    async fetchImageMapData() {
      try {
        const { data } = await this.$http.get(`portion-sizes/image-maps/${this.imageMapId}`);
        this.imageMapData = { ...data };
        this.imageMapLoaded = true;
      } catch (e) {
        console.log(e);
      }
    },
    // setDisplayQuestions(value: boolean) {
    //   this.displayQuestions = value;
    // },
    selectFood(value: string) {
      this.foodValue = value;
      this.foodSelected = true;
      this.setPanelOpen(1);
      this.submit();
    },
    selectPortionMethod(value: string) {
      this.portionMethodSelected = true;
      this.portionMethodValue = value;
      this.setPanelOpen(2);
      if (!this.imageMapLoaded) {
        this.fetchImageMapData();
      }
      this.submit();
    },
    selectPortion() {
      this.portionSelected = true;
      this.setPanelOpen(-1);
      this.submit();
    },
    submit() {
      if (this.foodSelected && this.portionMethodSelected && this.portionSelected) {
        console.log('submitted');
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
