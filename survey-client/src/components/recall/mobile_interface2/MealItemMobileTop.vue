<template>

</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'MealItemMobileTop',
  props: {
    foods: Array,
    name: String,
    time: String,
  },
  data() {
    return {};
  },
});
</script>
