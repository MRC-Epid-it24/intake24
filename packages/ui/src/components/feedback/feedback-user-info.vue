<template>
  <v-col cols="auto" class="d-flex flex-column">
    <div class="text-subtitle-1 font-weight-medium text-uppercase">
      {{ $t('feedback.physicalData.title') }}
    </div>
    <div v-if="userDemographic.physicalActivityLevel" class="text-subtitle-2">
      {{ userDemographic.physicalActivityLevel.name }}
    </div>
    <div v-if="ageAndSex.length" class="text-subtitle-2">
      {{ ageAndSex.join(' | ') }}
    </div>
    <div v-if="weightAndHeight.length" class="text-subtitle-2">
      {{ weightAndHeight.join(' | ') }}
    </div>
    <div v-if="userDemographic.physicalData.weightTarget" class="text-subtitle-2">
      {{
        $t('feedback.physicalData.weightTarget', {
          target: $t(
            `feedback.physicalData.weightTargets.${userDemographic.physicalData.weightTarget}`
          ),
        })
      }}
    </div>
    <v-btn
      link
      class="mt-2"
      color="primary"
      outlined
      :title="$t('feedback.physicalData.change')"
      :to="{ name: 'feedback-physical-data', params: { surveyId } }"
    >
      <v-icon left>fas fa-person-running</v-icon>
      {{ $t('feedback.physicalData.change') }}
    </v-btn>
    <v-btn
      link
      class="mt-2"
      color="primary"
      outlined
      :title="$t('feedback.physicalData.recall')"
      :to="{ name: 'survey-home', params: { surveyId } }"
    >
      <v-icon left>fas fa-bowl-food</v-icon>
      {{ $t('feedback.physicalData.recall') }}
    </v-btn>
  </v-col>
</template>

<script lang="ts">
import type { PropType } from '@vue/composition-api';
import { defineComponent } from '@vue/composition-api';
import type { UserDemographic } from '@intake24/ui/feedback';

export default defineComponent({
  name: 'FeedbackUserInfo',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
    userDemographic: {
      type: Object as PropType<UserDemographic>,
      required: true,
    },
  },

  computed: {
    ageAndSex(): string[] {
      const items = [];
      const { sex, birthdate } = this.userDemographic.physicalData;

      if (sex !== null)
        items.push(
          this.$t('feedback.physicalData.sex', {
            sex: this.$t(`feedback.physicalData.sexes.${sex}`),
          }).toString()
        );

      if (birthdate !== null)
        items.push(
          this.$t('feedback.physicalData.age', { age: this.userDemographic.getAge() }).toString()
        );

      return items;
    },
    weightAndHeight(): string[] {
      const items = [];
      const { heightCm, weightKg } = this.userDemographic.physicalData;

      if (heightCm !== null)
        items.push(this.$t('feedback.physicalData.height', { height: heightCm }).toString());

      if (weightKg !== null)
        items.push(this.$t('feedback.physicalData.weight', { weight: weightKg }).toString());

      return items;
    },
  },
});
</script>

<style lang="scss" scoped></style>
