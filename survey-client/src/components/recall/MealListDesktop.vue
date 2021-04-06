<template>
<v-card min-height="30rem" height="45rem" class="d-flex justify-center align-center mx-6">
	<v-list dense nav class="flex-grow-1 flex-shrink-0">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title"> Recall </v-list-item-title>
        <v-list-item-subtitle>
          {{ surveyName }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
		<v-card-text class="scroll-y" style="height: 40rem">
      <v-list-item v-for="meal in meals" :key="meal.name" link>
        <v-list-item-content>
          <meal-item :meal="meal"></meal-item>
        </v-list-item-content>
      </v-list-item>
		</v-card-text>
  </v-list>
</v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import MealItem from './MealItem.vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'MealList',

  components: {
    MealItem,
  },
  props: {
    surveyName: String,
    meals: Array,
  },

	async mounted(){
		console.log(this.meals);
	},

  data() {
    return {
    };
  },
});
</script>

<style lang="scss">
@import '../../scss/meallist.scss';
</style>
