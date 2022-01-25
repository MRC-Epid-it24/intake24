<template>
  <div>
    <v-row justify="center" :no-gutters="isMobile">
      <v-col v-for="item in foodData" cols="12" sm="6" lg="4" :key="item.nutrientTypeId">
        <canvas :id="`food-chart-${item.nutrientTypeId}`"></canvas>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Chart } from 'chart.js';
import { TopFoodData } from '@intake24/survey/feedback';

export default defineComponent({
  name: 'FeedbackChartArea',

  props: {
    foodData: {
      type: Array as () => TopFoodData[],
      required: true,
    },
  },

  computed: {
    foodChartData(): TopFoodData[] {
      return this.foodData.map((item) => {
        const labels: string[] = [];
        const data: number[] = [];
        const backgroundColor: string[] = [];

        item.chart.forEach((chartItem) => {
          labels.push(chartItem.label);
          data.push(chartItem.value);
          backgroundColor.push(chartItem.color);
        });

        return {
          ...item,
          chartJs: { labels, datasets: [{ data, backgroundColor }] },
        };
      });
    },
  },

  mounted() {
    setTimeout(() => {
      for (const item of this.foodChartData) {
        const el = document.getElementById(
          `food-chart-${item.nutrientTypeId}`
        ) as HTMLCanvasElement;
        if (!el) {
          console.log(`element not found`);
          return;
        }

        if (!item.chartJs) return;

        const myChart = new Chart(el, {
          type: 'doughnut',
          data: item.chartJs,
          options: { plugins: { legend: { position: 'bottom' } } },
        });
      }
    }, 1000);
  },

  /* setup() {
    const testData = {
      labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
      datasets: [
        {
          data: [30, 40, 60, 70, 5],
          backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        },
      ],
    };

    return { testData };
  }, */
});
</script>

<style lang="scss"></style>
