<template>
  <div>
    <h2 class="text-h2 font-weight-medium text-center mb-6 chart-print-title">
      {{ $t('feedback.topFoods.title') }}
    </h2>
    <v-row class="d-print-none" justify="center" no-gutters>
      <v-col
        v-for="chart in charts"
        :key="`screen-${chart.id}`"
        class="chart-wrapper"
        cols="12"
        md="6"
        xl="4"
      >
        <chart autoresize class="chart" :option="chart"></chart>
      </v-col>
    </v-row>
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
import { defineComponent } from 'vue';
import Chart from 'vue-echarts';

import { round } from '@intake24/common/util';

import type { TopFoodData } from './top-foods';

use([SVGRenderer, PieChart, TitleComponent, TooltipComponent]);

export default defineComponent({
  name: 'FeedbackChartArea',

  components: { Chart },

  props: {
    topFoods: {
      type: Object as PropType<TopFoodData>,
      required: true,
    },
  },

  computed: {
    charts() {
      const { colors, nutrients } = this.topFoods;

      const chartOptions: EChartsOption[] = nutrients.map((nutrient) => {
        const { name, unit, data } = nutrient;
        const id = nutrient.id.join(':');

        return {
          textStyle: {
            fontFamily: `"Open Sans", sans-serif`,
          },
          id,
          title: {
            text: this.$t('feedback.topFoods.chart', { nutrient: name }).toString(),
            left: 'center',
            textStyle: {
              fontWeight: 'bolder',
              fontSize: 18,
            },
          },
          left: 'center',
          tooltip: {
            trigger: 'item',
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
    },

    matchesPrintMedia(): boolean {
      return window.matchMedia('print').matches;
    },
  },
});
</script>

<style lang="scss">
.chart {
  height: 450px;
}

.chart-print-wrapper {
  height: 450px;
  width: 100%;
}

.chart-print {
  height: 450px;
  width: 680px;
  margin: auto;
}

@media print {
  .chart-print-title {
    page-break-after: avoid;
    break-after: avoid;
  }

  .chart-print-wrapper {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>
