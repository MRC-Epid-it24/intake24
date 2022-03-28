<template>
  <v-row justify="center" :no-gutters="isMobile">
    <v-col v-for="nutrient in topFoods.nutrients" class="mb-4" cols="auto" :key="nutrient.id">
      <canvas :id="`chart-${nutrient.id}`"></canvas>
      <v-divider class="my-4"></v-divider>
      <div class="title">Highest in {{ nutrient.name }}</div>
      <v-list max-width="300px" dense>
        <v-list-item v-for="(item, index) in nutrient.list" :key="item.name">
          <v-list-item-icon
            class="font-weight-bold my-auto mr-2"
            :style="{ color: `${topFoods.colors[index]}` }"
          >
            {{ index + 1 }}
          </v-list-item-icon>
          <v-list-item-content class="d-flex flex-row">
            <div>{{ item.name }}</div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { Chart } from 'chart.js';
import { TopFoodData } from '@intake24/ui/feedback';

export default defineComponent({
  name: 'FeedbackChartArea',

  props: {
    topFoods: {
      type: Object as PropType<TopFoodData>,
      required: true,
    },
  },

  mounted() {
    // TODO: sometimes charts won't render -> investigate (maybe only HMR issue)
    // maybe re-render charts when elements are in viewport
    setTimeout(() => {
      for (const item of this.topFoods.nutrients) {
        const el = document.getElementById(`chart-${item.id}`) as HTMLCanvasElement;

        if (!el) {
          console.log(`element not found`);
          return;
        }

        const myChart = new Chart(el, {
          type: 'doughnut',
          data: item.chartJs,
          options: { plugins: { legend: { display: false } } },
        });
      }
    }, 1000);
  },
});
</script>

<style lang="scss"></style>
