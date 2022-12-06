<template>
  <div>
    <v-tab-item key="options">
      <v-row class="mb-3">
        <v-col cols="12">
          <v-switch
            hide-details="auto"
            :input-value="leftovers"
            :label="$t('survey-schemes.questions.leftovers')"
            @change="update('leftovers', $event)"
          >
          </v-switch>
        </v-col>
      </v-row>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'AsServedPrompt',

  mixins: [basePrompt],

  props: {
    leftovers: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
