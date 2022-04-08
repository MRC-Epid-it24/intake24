<template>
  <div>
    <div class="text-subtitle-1 text-center mb-4">{{ userInfo.physicalActivityLevel.name }}</div>
    <v-row justify="space-around" align="center" class="mt-4">
      <v-col cols="auto" class="d-flex flex-column">
        <div>
          {{ $t('feedback.physicalData.weight', { weight: userInfo.physicalData.weightKg }) }}
        </div>
        <div>
          {{ $t('feedback.physicalData.height', { height: userInfo.physicalData.heightCm }) }}
        </div>
        <div>
          {{
            $t('feedback.physicalData.weightTarget', {
              target: $t(
                `feedback.physicalData.weightTargets.${userInfo.physicalData.weightTarget}`
              ),
            })
          }}
        </div>
        <v-btn
          link
          class="mt-2"
          color="primary"
          block
          outlined
          :title="$t('feedback.physicalData.change')"
          :to="{ name: 'feedback-physical-data', params: { surveyId } }"
        >
          <v-icon left>fas fa-person-running</v-icon>
          {{ $t('feedback.physicalData.change') }}
        </v-btn>
      </v-col>
      <v-divider vertical class="d-none d-sm-block"></v-divider>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn
          link
          class="mb-2"
          color="primary"
          outlined
          :title="$t('feedback.physicalData.recall')"
          :to="{ name: 'survey-home', params: { surveyId } }"
        >
          <v-icon left>fas fa-bowl-food</v-icon>
          {{ $t('feedback.physicalData.recall') }}
        </v-btn>
        <v-btn
          link
          class="mb-2"
          color="primary"
          outlined
          :title="$t('common.action.print')"
          @click="print"
        >
          <v-icon left>fas fa-print</v-icon>
          {{ $t('common.action.print') }}
        </v-btn>
        <v-btn
          link
          color="primary"
          outlined
          :title="$t('common.action.download')"
          @click="download"
        >
          <v-icon left>fas fa-download</v-icon>
          {{ $t('common.action.download') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { UserDemographic } from '@intake24/ui/feedback';
import { downloadFile } from '@intake24/ui/util';
import { useLoading } from '@intake24/ui/stores';

export default defineComponent({
  name: 'FeedbackUserDemographicInfo',

  props: {
    userInfo: {
      type: Object as PropType<UserDemographic>,
      required: true,
    },
  },

  computed: {
    surveyId(): string {
      return this.$route.params.surveyId;
    },
  },

  methods: {
    async download() {
      const loading = useLoading();
      loading.addItem('feedback-download');

      try {
        const res = await this.$http.get(`user/feedback`, {
          params: { surveyId: this.surveyId },
          responseType: 'arraybuffer',
          headers: { accept: 'application/pdf' },
        });
        downloadFile(res, `Intake24-MyFeedback-${new Date().toISOString().substring(0, 10)}.pdf`);
      } catch (err) {
        //
      } finally {
        loading.removeItem('feedback-download');
      }
    },
    print() {
      window.print();
    },
  },
});
</script>

<style lang="scss" scoped></style>
