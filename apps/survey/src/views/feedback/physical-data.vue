<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row justify="center" :no-gutters="isMobile">
      <v-col cols="12" sm="9" md="8">
        <v-card :flat="isMobile" :tile="isMobile">
          <v-card-title>{{ $t('feedback.physicalData.title') }}</v-card-title>
          <v-card-subtitle>{{ $t('feedback.physicalData.subtitle') }}</v-card-subtitle>
          <v-card-text class="pa-4">
            <v-form @keydown.native="errors.clear($event.target.name)" @submit.prevent="submit">
              <v-row>
                <v-col cols="12" lg="6">
                  <v-select
                    v-model="form.sex"
                    :disabled="canShowPhysicalDataField('sex')"
                    :error-messages="errors.get('sex')"
                    :items="sexes"
                    :label="$t('feedback.physicalData.sexes._')"
                    hide-details="auto"
                    name="sex"
                    outlined
                    prepend-icon="fa-genderless"
                    @change="errors.clear('sex')"
                  >
                    <template v-slot:item="{ item }">
                      <span :class="`${item.icon} mr-3`"></span>
                      {{ item.text }}
                    </template>
                    <template v-slot:selection="{ item }">
                      <span :class="`${item.icon} mr-3`"></span>
                      {{ item.text }}
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="form.birthdate"
                    :disabled="canShowPhysicalDataField('birthdate')"
                    :error-messages="errors.get('birthdate')"
                    :label="$t('feedback.physicalData.birthdate')"
                    hide-details="auto"
                    name="birthdate"
                    outlined
                    prepend-icon="fa-birthday-cake"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="form.heightCm"
                    :disabled="canShowPhysicalDataField('heightCm')"
                    :error-messages="errors.get('heightCm')"
                    :label="$t('feedback.physicalData.heightCm')"
                    hide-details="auto"
                    name="heightCm"
                    outlined
                    prepend-icon="fa-arrows-alt-v"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="form.weightKg"
                    :disabled="canShowPhysicalDataField('weightKg')"
                    :error-messages="errors.get('weightKg')"
                    :label="$t('feedback.physicalData.weightKg')"
                    hide-details="auto"
                    name="weightKg"
                    outlined
                    prepend-icon="fa-weight"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-select
                    v-model="form.physicalActivityLevelId"
                    :disabled="canShowPhysicalDataField('physicalActivityLevelId')"
                    :error-messages="errors.get('physicalActivityLevelId')"
                    :items="physicalActivityLevels"
                    :label="$t('feedback.physicalData.physicalActivityLevelId')"
                    hide-details="auto"
                    item-value="id"
                    item-text="name"
                    name="physicalActivityLevelId"
                    outlined
                    prepend-icon="fa-running"
                    @change="errors.clear('physicalActivityLevelId')"
                  ></v-select>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-select
                    v-model="form.weightTarget"
                    :disabled="canShowPhysicalDataField('weightTarget')"
                    :error-messages="errors.get('weightTarget')"
                    :items="weightTargets"
                    :label="$t('feedback.physicalData.weightTargets._')"
                    hide-details="auto"
                    name="weightTarget"
                    outlined
                    prepend-icon="fa-crosshairs"
                    @change="errors.clear('weightTarget')"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row justify="center" class="mt-3">
                <v-col cols="12" sm="6" md="5" lg="4">
                  <v-btn
                    :disabled="errors.any()"
                    :title="$t('common.action.continue')"
                    color="secondary"
                    block
                    type="submit"
                    x-large
                  >
                    {{ $t('common.action.continue') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from 'axios';
import { mapState } from 'pinia';
import { defineComponent } from '@vue/composition-api';
import { userService, feedbackService, UserPhysicalDataInput } from '@intake24/survey/services';
import { FeedbackPhysicalDataField, Sex, sexes, weightTargets } from '@intake24/common/feedback';
import { FeedbackSchemeEntryResponse, PhysicalActivityLevel } from '@intake24/common/types/http';
import { Errors } from '@intake24/common/util';
import { useLoading, useSurvey } from '@intake24/survey/stores';

export interface NullablePhysicalActivityLevel extends Omit<PhysicalActivityLevel, 'id'> {
  id: string | null;
}

export default defineComponent({
  name: 'FeedbackPhysicalData',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  data() {
    const genderIcon = (gender: Sex): string => {
      const icons: Record<Sex, string> = { m: 'fas fa-mars', f: 'fas fa-venus' };
      return icons[gender];
    };

    return {
      form: {
        sex: null,
        birthdate: null,
        heightCm: null,
        weightKg: null,
        physicalActivityLevelId: null,
        weightTarget: null,
      } as UserPhysicalDataInput,
      errors: new Errors(),
      sexes: [
        { text: this.$t('common.not.selected'), value: null, icon: 'fas fa-genderless' },
        ...sexes.map((value) => ({
          text: this.$t(`feedback.physicalData.sexes.${value}`),
          value,
          icon: genderIcon(value),
        })),
      ],
      physicalActivityLevels: [
        { id: null, name: this.$t('common.not.selected').toString(), coefficient: 0 },
      ] as NullablePhysicalActivityLevel[],
      weightTargets: [
        { text: this.$t('common.not.selected'), value: null },
        ...weightTargets.map((value) => ({
          text: this.$t(`feedback.physicalData.weightTargets.${value}`),
          value,
        })),
      ],
    };
  },

  computed: {
    ...mapState(useSurvey, ['parameters']),

    feedbackScheme(): FeedbackSchemeEntryResponse | undefined {
      return this.parameters?.feedbackScheme;
    },
  },

  async mounted() {
    const { surveyId } = this;

    const loading = useLoading();
    loading.addItem('feedback-physical-data');

    try {
      const [physicalData, feedbackData] = await Promise.all([
        userService.fetchPhysicalData(),
        feedbackService.getFeedbackData(),
      ]);

      if (physicalData) {
        const { userId, ...rest } = physicalData;
        this.form = { ...rest };
      }
      this.physicalActivityLevels = [
        { id: null, name: this.$t('common.not.selected').toString(), coefficient: 0 },
        ...feedbackData.physicalActivityLevels,
      ];
    } catch (err) {
      this.$router.push({ name: 'feedback-error', params: { surveyId } });
    } finally {
      loading.removeItem('feedback-physical-data');
    }
  },

  methods: {
    canShowPhysicalDataField(field: FeedbackPhysicalDataField): boolean {
      return !this.feedbackScheme?.physicalDataFields.includes(field);
    },

    async submit() {
      const { surveyId } = this;

      try {
        await userService.savePhysicalData(surveyId, this.form);
        this.$router.push({ name: 'feedback-home', params: { surveyId } });
      } catch (err) {
        if (!axios.isAxiosError(err)) {
          console.error(err);
          return;
        }

        const { response: { status = 0, data = {} } = {} } = err;
        if (status === 422 && 'errors' in data) this.errors.record(data.errors);
      }
    },
  },
});
</script>

<style lang="scss"></style>
