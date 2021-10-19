<template>
  <v-row justify="center">
    <v-col cols="12" sm="9" md="8">
      <v-card :flat="isMobile" :tile="isMobile">
        <v-container fluid>
          <v-card-title>About you</v-card-title>
          <v-card-subtitle>We only need few details about you</v-card-subtitle>
          <v-card-text>
            <v-form ref="form" @submit.prevent="submit">
              <v-row>
                <v-col cols="12" lg="6">
                  <v-select
                    v-model="form.sex"
                    :items="genders"
                    :label="`Sex`"
                    hide-details="auto"
                    name="sex"
                    outlined
                    prepend-icon="fa-genderless"
                  ></v-select>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="form.birthdate"
                    :label="`Year of birth`"
                    hide-details="auto"
                    name="birthdate"
                    outlined
                    prepend-icon="fa-birthday-cake"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="form.heightCm"
                    :label="`Height in centimeters`"
                    hide-details="auto"
                    name="heightCm"
                    outlined
                    prepend-icon="fa-arrows-alt-v"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="form.weightKg"
                    :label="`Weight in kilograms`"
                    hide-details="auto"
                    name="weightKg"
                    outlined
                    prepend-icon="fa-weight"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-select
                    v-model="form.physicalActivityLevelId"
                    :items="physicalActivityLevels"
                    :label="`Physical Activity Level`"
                    hide-details="auto"
                    item-value="id"
                    item-text="name"
                    name="physicalActivityLevelId"
                    outlined
                    prepend-icon="fa-running"
                  ></v-select>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-select
                    v-model="form.weightTarget"
                    :items="weightTargets"
                    :label="`Weight target`"
                    hide-details="auto"
                    item-value="id"
                    item-text="name"
                    name="weightTarget"
                    outlined
                    prepend-icon="fa-crosshairs"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row justify="center" class="mt-3">
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-btn x-large type="submit" color="secondary" block :title="`Submit`">
                    Submit
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { HenryCoefficient, WeightTarget } from '@common/types/http';
import { PhysicalActivityLevelAttributes, UserPhysicalDataAttributes } from '@common/types/models';
import { feedbackService, userService } from '@/services';

export default Vue.extend({
  name: 'Feedback',

  data() {
    return {
      surveyId: this.$route.params.surveyId,
      submissions: [],
      physicalData: null as null | UserPhysicalDataAttributes,
      henryCoefficients: [] as HenryCoefficient[],
      physicalActivityLevels: [] as PhysicalActivityLevelAttributes[],
      weightTargets: [] as WeightTarget[],
      genders: [
        { text: 'Male', value: 'm' },
        { text: 'Female', value: 'f' },
      ],
      form: {
        sex: null,
        birthdate: null,
        heightCm: null,
        weightKg: null,
        physicalActivityLevelId: null,
        weightTarget: null,
      },
    };
  },

  async mounted() {
    const [submissions, physicalData, henryCoefficients, physicalActivityLevels, weightTargets] =
      await Promise.all([
        userService.submissions(this.surveyId),
        userService.fetchPhysicalData(),
        feedbackService.fetchHenryCoefficients(),
        feedbackService.fetchPhysicalActivityLevels(),
        feedbackService.fetchWeightTargets(),
      ]);

    this.submissions = submissions;
    this.physicalData = physicalData;
    this.henryCoefficients = henryCoefficients;
    this.physicalActivityLevels = physicalActivityLevels;
    this.weightTargets = weightTargets;
  },

  methods: {
    async submit() {
      await userService.savePhysicalData(this.form);
    },
  },
});
</script>

<style lang="scss"></style>
