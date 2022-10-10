<template>
  <portion-layout v-bind="{ method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            {{ $t('portion.milkCereal.question') }}
          </v-card-text>
          <v-card-actions>
            <v-btn :color="displayQuestionStyle('yes')" @click="setDisplayQuestions(true)">
              {{ $t('common.action.confirm.yes') }}
            </v-btn>
            <v-btn :color="displayQuestionStyle('no')" @click="setDisplayQuestions(false)">
              {{ $t('common.action.confirm.no') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="displayQuestions">
      <v-col>
        <v-expansion-panels v-model="panel">
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              Please select the milk you had:
              <template #actions>
                <valid-invalid-icon :valid="foodSelected"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <!-- Likely call from /api/foods/{locale}/lookup-in-category, below is mockup -->
              <h4>Foods in this category:</h4>
              <v-list>
                <v-list-item @click="selectFood('almond milk')">Almond milk</v-list-item>
                <v-list-item @click="selectFood('hot milk')">Hot milk, semi-skimmed</v-list-item>
                <v-list-item @click="selectFood('hot milk')">Hot milk, whole</v-list-item>
                <v-list-item @click="selectFood('milk')">Milk, semi-skimmed</v-list-item>
                <v-list-item @click="selectFood('milk')">Milk, skimmed</v-list-item>
              </v-list>
              <v-btn>{{ $t('portion.milkCereal.foodSelectButton') }}</v-btn>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel v-if="foodSelected">
            <v-expansion-panel-header disable-icon-rotate>
              How would you like to measure the milk?
              <template #actions>
                <valid-invalid-icon :valid="portionMethodSelected"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <!-- Portion method - unless we should be assuming they'll measure it in bowls (as per the cerreal)? -->
              <v-row>
                <v-col class="col-6">
                  <v-card @click="selectPortionMethod('glasses')">
                    <v-img
                      src="https://it24-dev.mrc-epid.cam.ac.uk/images/portion/gsoftdrnk.jpg"
                    ></v-img>
                    <v-card-title>In glasses</v-card-title>
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

          <v-expansion-panel v-if="foodSelected">
            <v-expansion-panel-header disable-icon-rotate>
              Select how much milk you had:
              <template #actions>
                <valid-invalid-icon :valid="portionSelected"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>Please choose the level your milk came up to (without cereal).</p>
              <!-- Portion estimation - this will display the asServed gallery for the selected milk, using the bowl reference it was passed -->
              <v-img :src="imageMapData.baseImageUrl" @click="selectPortion()"></v-img>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- <v-card>Milk Cereal Prompt content here</v-card> -->
        <!-- select food -->
        <!-- portion size estimation -->
        <!-- portion size method -->
      </v-col>
    </v-row>
    <template #actions>
      <continue :disabled="!isValid" @click="submit"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MilkOnCerealPromptProps } from '@intake24/common/prompts';

import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'MilkOnCerealPrompt',

  mixins: [createBasePortion<MilkOnCerealPromptProps, any>()],

  props: {
    promptProps: {
      type: Object as PropType<MilkOnCerealPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      method: 'milk-on-cereal',
      displayQuestions: false,
      // Below are rough/testing vars to control UI prototype
      bowlType: 'A', // For testing until food linking
      foodSelected: false,
      foodValue: '',
      foodCode: 'SMLK',
      foodData: [] as any,
      portionMethodSelected: false,
      portionMethodValue: '',
      portionSelected: false,
      portionValue: '',
      imageMapId: 'milkbowlA',
      imageMapData: [] as any,
      imageMapLoaded: false,
      // If MCRL (milk_in_cereal) associated food category is triggered, we will wind up here
      // Associated_foods contains `text` field which is the question
    };
  },

  computed: {
    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    /* isValid() {
      return this.foodSelected && this.portionMethodSelected && this.portionSelected;
    }, */
  },

  methods: {
    // TODO: fix this as no milk will be false and not validate
    displayQuestionStyle(button: string) {
      if (button === 'yes' && this.displayQuestions) {
        return 'success';
      }
      return '';
    },

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

    setDisplayQuestions(value: boolean) {
      this.displayQuestions = value;
    },

    emitFoodSelected(value: string) {
      this.foodValue = value;
      this.foodSelected = true;
      this.setPanel(1);
    },

    selectPortionMethod(value: string) {
      this.portionMethodSelected = true;
      this.portionMethodValue = value;
      this.setPanel(2);
      if (!this.imageMapLoaded) {
        this.fetchImageMapData();
      }
    },

    selectPortion() {
      this.portionSelected = true;
      this.setPanel(-1);
    },

    submit() {
      if (this.foodSelected && this.portionMethodSelected && this.portionSelected) {
        console.log('submitted');
      } else {
        console.log('not complete');
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
