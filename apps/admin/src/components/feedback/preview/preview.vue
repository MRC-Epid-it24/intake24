<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template #activator="{ attrs, on }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          class="ml-3"
          color="secondary"
          :title="$t('feedback-schemes.preview.title')"
          v-on="on"
        >
          <v-icon left>
            $search
          </v-icon>
          {{ $t('feedback-schemes.preview._') }}
        </v-btn>
      </slot>
    </template>
    <v-card tile>
      <v-toolbar color="secondary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('feedback-schemes.preview.title') }}</v-toolbar-title>
      </v-toolbar>
      <v-container class="pa-0" fluid>
        <h1 class="text-h1 font-weight-medium text-center">
          {{ $t('feedback.title') }}
        </h1>
        <div v-if="feedbackDicts" class="d-flex flex-column">
          <feedback-cards
            v-if="showCards"
            v-bind="{ cards }"
            :class="`feedback-area order-${getSectionOrder('cards')}`"
          />
          <v-sheet
            v-if="showTopFoods"
            :class="`order-${getSectionOrder('topFoods')}`"
            color="white"
          >
            <feedback-top-foods v-bind="{ topFoods }" class="feedback-area" />
          </v-sheet>
          <feedback-meals
            v-if="showMeals"
            :class="`feedback-area order-${getSectionOrder('meals')}`"
            :config="feedbackScheme.meals"
            :nutrient-types="feedbackDicts.feedbackData.nutrientTypes"
            :submissions="submissions"
            :survey-stats="feedbackDicts.surveyStats"
          />
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';

import type { FeedbackImage, FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { feedbackService } from '@intake24/admin/services';
import {
  buildCardParams,
  buildTopFoods,
  FeedbackCards,
  FeedbackMeals,
  FeedbackTopFoods,
  useFeedback,
} from '@intake24/ui/feedback';

import * as previewData from './preview-data';

export default defineComponent({
  name: 'FeedbackPreview',

  components: { FeedbackCards, FeedbackMeals, FeedbackTopFoods },

  props: {
    feedbackScheme: {
      type: Object as PropType<FeedbackSchemeEntry>,
      required: true,
    },
    images: {
      type: Array as PropType<FeedbackImage[]>,
      default: () => [],
    },
  },

  setup(props) {
    const dialog = ref(false);

    const imageMap = computed(() => props.images.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.url;
      return acc;
    }, {}));

    const scheme = computed(() => ({
      ...props.feedbackScheme,
      cards: props.feedbackScheme.cards.map(card => ({ ...card, image: imageMap.value[card.image] })),
    }));

    const { cards, feedbackDicts, getSectionOrder, topFoods, showCards, showMeals, showTopFoods }
      = useFeedback(scheme);

    const buildFeedback = async () => {
      const results = await feedbackService.getFeedbackResults({
        cards: scheme.value.cards,
        groups: scheme.value.demographicGroups,
        henryCoefficients: scheme.value.henryCoefficients,
        physicalData: previewData.physicalData,
        submissions: previewData.submissions,
      });

      feedbackDicts.value = results.feedbackDicts;

      const {
        surveyStats,
        feedbackData: { nutrientTypes },
      } = feedbackDicts.value;

      const selected = previewData.submissions.map(({ id }) => id);

      const foods = surveyStats.getReducedFoods(selected);
      const averageIntake = surveyStats.getAverageIntake(selected);
      const fruitAndVegPortions = surveyStats.getFruitAndVegPortions(selected);

      cards.value = buildCardParams(results.feedbackDicts.cards, {
        foods,
        userDemographic: results.userDemographic,
        averageIntake,
        fruitAndVegPortions,
      });
      topFoods.value = buildTopFoods(scheme.value.topFoods, foods, nutrientTypes);
    };

    const close = () => {
      dialog.value = false;
    };

    onMounted(async () => {
      await buildFeedback();
    });

    watch(scheme, async () => {
      await buildFeedback();
    }, { deep: true });

    return {
      dialog,
      cards,
      close,
      feedbackDicts,
      getSectionOrder,
      topFoods,
      showCards,
      showMeals,
      showTopFoods,
      ...previewData,
    };
  },
});
</script>

<style lang="scss">
.feedback-area {
  padding: 16px 0 !important;

  @media print {
    padding: 0 !important;
  }
}
</style>
