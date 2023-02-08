<template>
  <v-col class="d-flex flex-column feedback-user-info" cols>
    <v-card>
      <v-toolbar color="grey lighten-4" flat tile>
        <v-toolbar-title class="text-subtitle-1 font-weight-medium text-uppercase">
          {{ $t('feedback.physicalData.title') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              icon
              :title="$t('feedback.physicalData.change')"
              :to="{ name: 'feedback-physical-data', params: { surveyId } }"
              v-on="on"
            >
              <v-icon>$edit</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('feedback.physicalData.change') }}</span>
        </v-tooltip>
      </v-toolbar>
      <v-list v-if="physicalData.length" class="py-0">
        <template v-for="(item, idx) in physicalData">
          <v-list-item :key="idx">
            <v-list-item-content>
              <v-list-item-subtitle>
                {{ item }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="idx + 1 < physicalData.length" :key="`div-${idx}`"></v-divider>
        </template>
      </v-list>
    </v-card>
    <!-- <v-btn
      class="mt-2 mx-auto"
      color="primary"
      link
      outlined
      :title="$t('feedback.physicalData.recall')"
      :to="{ name: 'survey-home', params: { surveyId } }"
    >
      <v-icon left>fas fa-bowl-food</v-icon>
      {{ $t('feedback.physicalData.recall') }}
    </v-btn> -->
  </v-col>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { UserDemographic } from './classes';

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
    physicalData() {
      const { userDemographic } = this;
      const items: string[] = [];

      if (userDemographic.physicalActivityLevel)
        items.push(userDemographic.physicalActivityLevel.name);

      if (this.ageAndSex.length) items.push(this.ageAndSex.join(' | '));

      if (this.weightAndHeight.length) items.push(this.weightAndHeight.join(' | '));

      if (userDemographic.physicalData.weightTarget)
        items.push(
          this.$t('feedback.physicalData.weightTarget', {
            target: this.$t(
              `feedback.physicalData.weightTargets.${userDemographic.physicalData.weightTarget}`
            ),
          }).toString()
        );

      return items;
    },
  },
});
</script>

<style lang="scss" scoped>
.feedback-user-info {
  max-width: 35rem;
}
</style>
