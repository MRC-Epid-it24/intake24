<template>
  <v-sheet color="white">
    <v-row justify="center" :no-gutters="isMobile">
      <v-col v-for="nutrient in foodData.nutrients" class="mb-4" cols="auto" :key="nutrient.id">
        <canvas :id="`chart-${nutrient.id}`"></canvas>
        <v-divider class="my-4"></v-divider>
        <div class="title">Highest in {{ nutrient.name }}</div>
        <v-list max-width="300px" dense>
          <v-list-item v-for="(item, index) in nutrient.list" :key="item.name">
            <v-list-item-icon
              class="font-weight-bold my-auto"
              :style="{ color: `${foodData.colors[index]}` }"
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
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Chart } from 'chart.js';
import { TopFoodData } from '@intake24/survey/feedback';

export default defineComponent({
  name: 'FeedbackChartArea',

  props: {
    foodData: {
      type: Object as () => TopFoodData,
      required: true,
    },
  },

  mounted() {
    setTimeout(() => {
      for (const item of this.foodData.nutrients) {
        const el = document.getElementById(`chart-${item.id}`) as HTMLCanvasElement;

        if (!el) {
          console.log(`element not found`);
          return;
        }

        const myChart = new Chart(el, {
          type: 'doughnut',
          data: item.chartJs,
          options: { plugins: { legend: { position: 'bottom' } } },
        });
      }
    }, 1000);
  },
});
</script>

<style lang="scss"></style>
