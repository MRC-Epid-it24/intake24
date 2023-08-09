<template>
  <div>
    <v-tab-item key="options">
      <v-row>
        <v-col cols="12">
          <v-switch
            hide-details="auto"
            :input-value="multiple"
            :label="$t('survey-schemes.prompts.associated-foods-prompt.multiple')"
            @change="update('multiple', $event)"
          ></v-switch>
        </v-col>
      </v-row>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'AssociatedFoodsPrompt',

  mixins: [basePrompt],

  props: {
    multiple: {
      type: Boolean as PropType<Prompts['associated-foods-prompt']['multiple']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
