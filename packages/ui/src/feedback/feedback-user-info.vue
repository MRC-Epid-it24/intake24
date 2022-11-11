<template>
  <v-col class="d-flex flex-column feedback-user-info" cols>
    <v-card flat tile>
      <v-toolbar flat tile>
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
      <v-list class="py-0" dense>
        <v-list-item v-if="userDemographic.physicalActivityLevel" link>
          <v-list-item-content>
            <v-list-item-subtitle>
              {{ userDemographic.physicalActivityLevel.name }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-if="ageAndSex.length" link>
          <v-list-item-content>
            <v-list-item-subtitle>{{ ageAndSex.join(' | ') }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-if="weightAndHeight.length" link>
          <v-list-item-content>
            <v-list-item-subtitle>{{ weightAndHeight.join(' | ') }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-if="userDemographic.physicalData.weightTarget" link>
          <v-list-item-content>
            <v-list-item-subtitle>
              {{
                $t('feedback.physicalData.weightTarget', {
                  target: $t(
                    `feedback.physicalData.weightTargets.${userDemographic.physicalData.weightTarget}`
                  ),
                })
              }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <v-btn
      class="mt-2 mx-auto"
      color="primary"
      link
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
  },
});
</script>

<style lang="scss" scoped>
.feedback-user-info {
  max-width: 35rem;
}
</style>
