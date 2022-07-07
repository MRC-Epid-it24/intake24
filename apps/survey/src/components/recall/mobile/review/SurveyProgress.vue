<template>
  <v-item-group class="ma-2">
    <v-row
      justify-center
      dense
      style="flex-wrap: nowrap font-size: x-small;
  font-weight: bold"
    >
      <v-col v-for="(item, idx) in items" :key="idx" class="flex-grow-1 text-center">
        {{ item.time.length !== 0 ? item.time : '_:_' }}
        <v-item>
          <v-card
            flat
            dense
            class="d-flex align-center"
            :color="colourPicker(item)"
            height="1rem"
            width="100%"
          >
          </v-card>
        </v-item>
        {{
          item.name
            .match(/\b(\w)/g)
            .join('')
            .toUpperCase()
        }}
      </v-col>
    </v-row>
  </v-item-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SurveyProgress',

  props: {
    items: Array,
  },

  data() {
    return {};
  },

  methods: {
    // TODO: Use another criteria for 'success' and indication of a complited recall for this meal
    colourPicker(item: any) {
      if (item.time.length !== 0) return 'secondary';
      return 'primary';
    },
  },
});
</script>
