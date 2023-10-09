<template>
  <div>
    <h2 class="text-h2 font-weight-medium text-center mb-6 chart-print-title">
      {{ $t('feedback.meals.title') }}
    </h2>
    <v-container>
      <v-row class="mb-6" justify="center">
        <v-col cols="12" sm="auto">
          <v-select
            v-model="selected"
            class="mb-6"
            hide-details="auto"
            :items="submissionItems"
            :label="$t('recall.submissions._')"
            name="submissions"
            prepend-inner-icon="fas fa-calendar-day"
            solo
          >
          </v-select>
          <v-data-table
            class="elevation-1"
            :headers="headers"
            :hide-default-footer="true"
            :items="mealStats.table.tableData"
          ></v-data-table>
        </v-col>
      </v-row>
      <v-row class="d-print-none" justify="center" no-gutters>
        <v-col
          v-for="chart in charts"
          :key="`screen-${chart.id}`"
          class="chart-wrapper"
          cols="12"
          md="6"
          xl="4"
        >
          <v-card class="pa-4">
            <chart autoresize class="chart" :option="chart"></chart>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mb-6" justify="center">
        <v-col cols="12" sm="auto"> </v-col>
      </v-row>
    </v-container>
    <div class="d-none d-print-block">
      <div v-for="chart in charts" :key="`print-${chart.id}`" class="chart-print-wrapper">
        <chart autoresize class="chart-print" :option="chart"></chart>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { EChartsOption } from 'echarts';
import type { PropType } from 'vue';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed, defineComponent, ref } from 'vue';
import Chart from 'vue-echarts';

import type { FeedbackMeals } from '@intake24/common/feedback';
import type { NutrientType } from '@intake24/common/types/http';
import { round } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

import type { SurveyStats, SurveySubmission } from '../classes';
import { buildMealStats } from '../meal-stats';

use([SVGRenderer, PieChart, TitleComponent, TooltipComponent]);

export default defineComponent({
  name: 'FeedbackMeals',

  components: { Chart },

  props: {
    config: {
      type: Object as PropType<FeedbackMeals>,
      required: true,
    },
    surveyStats: {
      type: Object as PropType<SurveyStats>,
      required: true,
    },
    nutrientTypes: {
      type: Array as PropType<NutrientType[]>,
      default: () => [],
    },
    submissions: {
      type: Array as PropType<SurveySubmission[]>,
      default: () => [],
    },
  },

  setup(props) {
    const { i18n, translate } = useI18n();

    const selected = ref(props.submissions.length ? props.submissions[0].id : null);

    const mealStats = computed(() =>
      buildMealStats(
        props.config,
        selected.value ? props.surveyStats.getMealStats(selected.value) : [],
        props.nutrientTypes
      )
    );

    const submissionItems = computed(() =>
      props.submissions.map((item, idx) => ({
        text: `${i18n.t('recall.submissions._')} ${idx + 1}  | ${new Date(
          item.endTime
        ).toLocaleDateString()}`,
        value: item.id,
      }))
    );

    const headers = computed(() =>
      mealStats.value.table.fields.map(({ header, fieldId }) => ({
        text: translate(header),
        value: fieldId,
      }))
    );

    const charts = computed(() => {
      const {
        chart: { chartData, colors },
      } = mealStats.value;

      const chartOptions: EChartsOption[] = chartData.map((item) => {
        const { name, unit, data } = item;
        const id = item.id.join(':');

        return {
          textStyle: {
            fontFamily: `Rubik, sans-serif`,
          },
          id,
          title: {
            text: i18n.t('feedback.meals.chart', { nutrient: name }).toString(),
            left: 'center',
            textStyle: {
              fontWeight: 'bolder',
              fontSize: 18,
            },
          },
          left: 'center',
          tooltip: {
            trigger: 'item',
            position: (point, params, dom, rect, { contentSize, viewSize }) => [
              viewSize[0] / 2 - contentSize[0] / 2,
              '40%',
            ],
            formatter: ({ seriesName, name: itemName, value, percent }: any) =>
              `<strong>${seriesName}</strong> <br/> ${itemName}: ${round(
                value
              )} ${unit} (${Math.round(percent ?? 0)}%)`,
          },
          series: [
            {
              id,
              name,
              type: 'pie',
              radius: ['35%', '70%'],
              color: colors,
              data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
              itemStyle: {
                borderRadius: 5,
                borderColor: '#fff',
                borderWidth: 2,
              },
              label: {
                alignTo: 'edge',
                formatter: ({ name: itemName, value, percent }) =>
                  `${itemName} \n {times|${round(
                    typeof value === 'number' ? value : 0
                  )} ${unit} (${Math.round(percent ?? 0)}%)}`,
                minMargin: 5,
                edgeDistance: 10,
                lineHeight: 15,
                rich: {
                  times: {
                    fontSize: 12,
                    color: '#999',
                  },
                },
              },
              labelLine: {
                length: 15,
                length2: 0,
                maxSurfaceAngle: 80,
              },
            },
          ],
        };
      });

      return chartOptions;
    });

    return {
      charts,
      translate,
      headers,
      mealStats,
      selected,
      submissionItems,
    };
  },
});
</script>

<style lang="scss"></style>
